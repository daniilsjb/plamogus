package lv.tsi.uap.server.assignment.endpoint;

import lv.tsi.uap.server.assignment.service.AssignmentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@JsonTest
class AssignmentResponseTest {

    @Autowired
    private JacksonTester<AssignmentResponse> tester;

    private String json() {
        return """
            {
              "id": "9294d3eb-e967-47db-b48d-a761490b18ef",
              "title": "Programming Lab #3",
              "description": "The report should be submitted in Markdown.",
              "completed": false,
              "creationTime": "2023-05-02T19:51:34.069354877Z",
              "deadlineTime": "2023-12-31T15:36:21.005435257Z",
              "type": "REPORT",
              "course": {
                "id": "0e59eaa1-3770-466c-95a5-4e6eaf1b1ec5",
                "code": "ITP"
              }
            }
            """;
    }

    private AssignmentResponse request() {
        return AssignmentResponse.builder()
            .id(UUID.fromString("9294d3eb-e967-47db-b48d-a761490b18ef"))
            .title("Programming Lab #3")
            .description("The report should be submitted in Markdown.")
            .completed(false)
            .creationTime(Instant.parse("2023-05-02T19:51:34.069354877Z"))
            .deadlineTime(Instant.parse("2023-12-31T15:36:21.005435257Z"))
            .type(AssignmentType.REPORT)
            .course(AssignmentResponse.Course.builder()
                .id(UUID.fromString("0e59eaa1-3770-466c-95a5-4e6eaf1b1ec5"))
                .code("ITP")
                .build())
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
