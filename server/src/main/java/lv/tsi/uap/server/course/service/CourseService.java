package lv.tsi.uap.server.course.service;

import lombok.NonNull;
import lv.tsi.uap.server.course.endpoint.CourseQuery;

import java.util.List;
import java.util.UUID;

public interface CourseService {

    Course create(@NonNull Course entity);

    List<Course> findAll(CourseQuery query);

    Course findOne(@NonNull UUID id);

    Course update(@NonNull Course entity);

    void delete(@NonNull UUID id);

}
