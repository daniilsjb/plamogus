package lv.tsi.uap.server.component.course.endpoint;

import lombok.Builder;
import lombok.Value;

import java.util.UUID;

@Value
@Builder
class CourseResponse {

    private final UUID id;
    private final String code;
    private final String title;
    private final String description;
    private final Integer semester;

}
