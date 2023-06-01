package lv.tsi.uap.server.component.course.endpoint;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@JsonTest
class CourseResponseTest {

    @Autowired
    private JacksonTester<CourseResponse> tester;

    private String json() {
        return """
            {
              "id": "b6783681-3385-4823-919e-1448daae05c0",
              "code": "DSA",
              "title": "Data Structures and Algorithms",
              "description": "Assignments can be completed in any language of choice.",
              "semester": 3
            }
            """;
    }

    private CourseResponse request() {
        return CourseResponse.builder()
            .id(UUID.fromString("b6783681-3385-4823-919e-1448daae05c0"))
            .code("DSA")
            .title("Data Structures and Algorithms")
            .description("Assignments can be completed in any language of choice.")
            .semester(3)
            .build();
    }

    @Test
    @DisplayName("Should deserialize")
    void scenario_0bf6a901b0304d6791834aca0fedacb4() throws Exception {
        assertThat(tester.parseObject(json())).isEqualTo(request());
    }

    @Test
    @DisplayName("Should serialize")
    void scenario_92463e095fd9465287baf9379e0838a4() throws Exception {
        assertThat(tester.write(request())).isEqualToJson(json());
    }

}
