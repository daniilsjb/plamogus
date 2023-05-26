package lv.tsi.uap.server.component.assignment.endpoint;

import lv.tsi.uap.server.component.assignment.service.AssignmentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@JsonTest
class AssignmentRequestTest {

    @Autowired
    private JacksonTester<AssignmentRequest> tester;

    private String json() {
        return """
            {
              "title": "Programming Lab #3",
              "description": "The report should be submitted in Markdown.",
              "deadlineTime": "2023-12-31T15:36:21.005435257Z",
              "type": "REPORT",
              "courseId": "0e59eaa1-3770-466c-95a5-4e6eaf1b1ec5"
            }
            """;
    }

    private AssignmentRequest request() {
        return AssignmentRequest.builder()
            .title("Programming Lab #3")
            .description("The report should be submitted in Markdown.")
            .deadlineTime(Instant.parse("2023-12-31T15:36:21.005435257Z"))
            .type(AssignmentType.REPORT)
            .courseId(UUID.fromString("0e59eaa1-3770-466c-95a5-4e6eaf1b1ec5"))
            .build();
    }

    @Test
    @DisplayName("Should deserialize")
    void shouldDeserialize() throws Exception {
        assertThat(tester.parseObject(json())).isEqualTo(request());
    }

    @Test
    @DisplayName("Should serialize")
    void shouldSerialize() throws Exception {
        assertThat(tester.write(request())).isEqualToJson(json());
    }

}
