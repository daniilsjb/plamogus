package lv.tsi.uap.server.course.service;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
class DefaultCourseService implements CourseService {

    private final CourseRepository courses;

    @Override
    public Course create(@NonNull Course entity) {
        entity.setId(UUID.randomUUID());
        return courses.save(entity);
    }

    @Override
    public List<Course> findAll() {
        return courses.findAll();
    }

    @Override
    public Course findOne(@NonNull UUID id) {
        return courses.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Override
    public Course update(@NonNull Course entity) {
        return courses.save(entity);
    }

    @Override
    public void delete(@NonNull UUID id) {
        courses.deleteById(id);
    }

}
