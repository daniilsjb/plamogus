package lv.tsi.uap.server.course.service;

import lombok.NonNull;

import java.util.List;
import java.util.UUID;

public interface CourseService {

    Course create(@NonNull Course entity);

    List<Course> findAll();

    Course findOne(@NonNull UUID id);

    Course update(@NonNull Course entity);

    void delete(@NonNull UUID id);

}
