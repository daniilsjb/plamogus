package lv.tsi.uap.server.step.endpoint;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

import static org.assertj.core.api.Assertions.assertThat;

@JsonTest
class StepRequestTest {

    @Autowired
    private JacksonTester<StepRequest> tester;

    private String json() {
        return """
            { "title": "Hello, world!" }
            """;
    }

    private StepRequest request() {
        return StepRequest.builder()
            .title("Hello, world!")
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
