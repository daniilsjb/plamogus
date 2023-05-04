package lv.tsi.uap.server.course.endpoint;

import lombok.Builder;
import lombok.Value;

import java.util.UUID;

@Value
@Builder
class CourseResponse {

    UUID id;
    String code;
    String title;
    String description;
    Integer semester;

}
