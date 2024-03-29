package com.busanfullcourse.bfc.api.service;

import com.busanfullcourse.bfc.api.request.CustomPlaceScheduleReq;
import com.busanfullcourse.bfc.api.request.CustomPlaceUpdateReq;
import com.busanfullcourse.bfc.common.util.ExceptionUtil;
import com.busanfullcourse.bfc.db.entity.CustomPlace;
import com.busanfullcourse.bfc.db.entity.FullCourse;
import com.busanfullcourse.bfc.db.entity.Schedule;
import com.busanfullcourse.bfc.db.entity.User;
import com.busanfullcourse.bfc.db.repository.CustomPlaceRepository;
import com.busanfullcourse.bfc.db.repository.FullCourseRepository;
import com.busanfullcourse.bfc.db.repository.ScheduleRepository;
import com.busanfullcourse.bfc.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.DuplicateFormatFlagsException;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomPlaceService {

    private final CustomPlaceRepository customPlaceRepository;
    private final UserRepository userRepository;
    private final FullCourseRepository fullCourseRepository;
    private final ScheduleRepository scheduleRepository;

    public Map<String, Long> createCustomPlace(CustomPlaceScheduleReq req, String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));
        CustomPlace customPlace = customPlaceRepository.save(
                CustomPlace.builder()
                        .name(req.getName())
                        .address(req.getAddress())
                        .lat(req.getLat())
                        .lon(req.getLon())
                        .user(user)
                        .build()
        );

        Schedule schedule = addCustomPlaceSchedule(req, customPlace.getCustomPlaceId());

        Map<String, Long> map = new HashMap<>();
        map.put("scheduleId", schedule.getScheduleId());
        return map;
    }

    public Schedule addCustomPlaceSchedule(CustomPlaceScheduleReq customPlaceScheduleReq, Long customPlaceId){
        FullCourse fullCourse = fullCourseRepository.getById(customPlaceScheduleReq.getFullCourseId());
        CustomPlace customPlace = customPlaceRepository.getById(customPlaceId);

        // 중복된 일정이 있는지 검사
        if (Boolean.TRUE.equals(scheduleRepository.existsByFullCourseFullCourseIdAndDayAndSequence(
                customPlaceScheduleReq.getFullCourseId(), customPlaceScheduleReq.getDay(), customPlaceScheduleReq.getSequence()))) {
            throw new DuplicateFormatFlagsException(ExceptionUtil.SCHEDULE_DUPLICATE);
        }
        return scheduleRepository.save(
                Schedule.builder()
                        .day(customPlaceScheduleReq.getDay())
                        .sequence(customPlaceScheduleReq.getSequence())
                        .memo(customPlaceScheduleReq.getMemo())
                        .fullCourse(fullCourse)
                        .customPlace(customPlace)
                        .build());
    }

    public Page<CustomPlace> getCustomPlaceListByUserId(String username, Pageable pageable) {
        return customPlaceRepository.findAllByUserUsername(username, pageable);
    }

    public void updateCustomPlace(CustomPlaceUpdateReq req, Long customPlaceId, String username) throws IllegalAccessException {
        CustomPlace customPlace = customPlaceRepository.findById(customPlaceId).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.PLACE_NOT_FOUND));
        if (!customPlace.getUser().getUsername().equals(username)) {
            throw new IllegalAccessException(ExceptionUtil.NOT_MYSELF);
        }
        customPlace.setAddress(req.getAddress());
        customPlace.setLat(req.getLat());
        customPlace.setLon(req.getLon());
        customPlace.setName(req.getName());
        customPlaceRepository.save(customPlace);

    }

    public void deleteCustomPlace(Long customPlaceId, String username) throws IllegalAccessException {
        CustomPlace customPlace = customPlaceRepository.findById(customPlaceId).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.PLACE_NOT_FOUND));
        if (!customPlace.getUser().getUsername().equals(username)) {
            throw new IllegalAccessException(ExceptionUtil.NOT_MYSELF);
        }
        customPlaceRepository.deleteById(customPlaceId);
    }
}
