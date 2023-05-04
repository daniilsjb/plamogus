package lv.tsi.uap.server.course.endpoint;

import lombok.NonNull;
import lv.tsi.uap.server.course.service.Course;
import org.springframework.stereotype.Component;

@Component
class CourseConverter {

    public Course toEntity(@NonNull CourseRequest request) {
        var course = new Course();
        course.setCode(request.getCode());
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setSemester(request.getSemester());
        return course;
    }

    public CourseResponse toResponse(@NonNull Course entity) {
        return CourseResponse.builder()
            .id(entity.getId())
            .code(entity.getCode())
            .title(entity.getTitle())
            .description(entity.getDescription())
            .semester(entity.getSemester())
            .build();
    }

}
