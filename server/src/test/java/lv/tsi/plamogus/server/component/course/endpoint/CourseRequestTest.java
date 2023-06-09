package lv.tsi.plamogus.server.component.course.endpoint;

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
    void scenario_2279a69661bb4c2bb7dbecdcc1b244dc() throws Exception {
        assertThat(tester.parseObject(json())).isEqualTo(request());
    }

    @Test
    @DisplayName("Should serialize")
    void scenario_f90fa88f62754117a561f932dc756c17() throws Exception {
        assertThat(tester.write(request())).isEqualToJson(json());
    }

}
