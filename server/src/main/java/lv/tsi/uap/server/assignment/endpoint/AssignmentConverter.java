package lv.tsi.uap.server.assignment.endpoint;

import lombok.NonNull;
import lv.tsi.uap.server.assignment.service.Assignment;
import lv.tsi.uap.server.course.service.Course;
import org.springframework.stereotype.Component;

@Component
class AssignmentConverter {

    public Assignment toEntity(@NonNull AssignmentRequest request) {
        var entity = new Assignment();
        entity.setTitle(request.getTitle());
        entity.setDescription(request.getDescription());
        entity.setDeadlineTime(request.getDeadlineTime());
        entity.setType(request.getType());
        if (request.getCourseId() != null) {
            entity.setCourse(new Course(request.getCourseId()));
        }
        return entity;
    }

    public AssignmentResponse toResponse(@NonNull Assignment entity) {
        var builder = AssignmentResponse.builder()
            .id(entity.getId())
            .title(entity.getTitle())
            .description(entity.getDescription())
            .completed(entity.getCompleted())
            .creationTime(entity.getCreationTime())
            .deadlineTime(entity.getDeadlineTime())
            .type(entity.getType());

        var courseEntity = entity.getCourse();
        if (courseEntity != null) {
            builder.course(AssignmentResponse.Course.builder()
                .id(courseEntity.getId())
                .code(courseEntity.getCode())
                .build());
        }

        return builder.build();
    }

}
