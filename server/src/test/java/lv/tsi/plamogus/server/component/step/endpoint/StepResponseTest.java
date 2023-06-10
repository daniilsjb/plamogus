package lv.tsi.plamogus.server.component.step.endpoint;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@JsonTest
class StepResponseTest {

    @Autowired
    private JacksonTester<StepResponse> tester;

    private String json() {
        return """
            {
              "id": "c4289ce1-5d46-4c27-8f8d-b4d42a2c1e0d",
              "title": "Hello, world!",
              "completed": false
            }
            """;
    }

    private StepResponse request() {
        return StepResponse.builder()
            .id(UUID.fromString("c4289ce1-5d46-4c27-8f8d-b4d42a2c1e0d"))
            .title("Hello, world!")
            .completed(false)
            .build();
    }

    @Test
    @DisplayName("Should deserialize")
    void scenario_ae20bf5087974f248cf6d8881248b7a7() throws Exception {
        assertThat(tester.parseObject(json())).isEqualTo(request());
    }

    @Test
    @DisplayName("Should serialize")
    void scenario_c3a3af11029d41efba81f31dced62a55() throws Exception {
        assertThat(tester.write(request())).isEqualToJson(json());
    }

}
