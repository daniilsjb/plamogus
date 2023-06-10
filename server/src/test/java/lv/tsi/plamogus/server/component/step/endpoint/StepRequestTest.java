package lv.tsi.plamogus.server.component.step.endpoint;

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
    void scenario_b8b86543127d4ccd9fa129c8b8916097() throws Exception {
        assertThat(tester.parseObject(json())).isEqualTo(request());
    }

    @Test
    @DisplayName("Should serialize")
    void scenario_19c25fdc0049497bbbf90937f8b2974c() throws Exception {
        assertThat(tester.write(request())).isEqualToJson(json());
    }

}
