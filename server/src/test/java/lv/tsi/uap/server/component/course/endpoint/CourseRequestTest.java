package lv.tsi.uap.server.component.course.endpoint;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

import static org.assertj.core.api.Assertions.assertThat;

@JsonTest
class CourseRequestTest {

    @Autowired
    private JacksonTester<CourseRequest> tester;

    private String json() {
        return """
            {
              "code": "DSA",
              "title": "Data Structures and Algorithms",
              "description": "Assignments can be completed in any language of choice.",
              "semester": 3
            }
            """;
    }

    private CourseRequest request() {
        return CourseRequest.builder()
            .code("DSA")
            .title("Data Structures and Algorithms")
            .description("Assignments can be completed in any language of choice.")
            .semester(3)
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
