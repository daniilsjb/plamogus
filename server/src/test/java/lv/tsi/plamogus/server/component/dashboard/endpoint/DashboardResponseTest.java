package lv.tsi.plamogus.server.component.dashboard.endpoint;

import lv.tsi.plamogus.server.component.assignment.service.AssignmentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@JsonTest
class DashboardResponseTest {

    @Autowired
    private JacksonTester<DashboardResponse> tester;

    private String json() {
        return """
            {
                "pendingCount": 5,
                "overdueCount": 2,
                "types": [
                    {
                        "type": "REPORT",
                        "count": 3
                    },
                    {
                        "type": "HOMEWORK",
                        "count": 7
                    }
                ],
                "semesters": [
                    {
                        "semester": 1,
                        "count": 4
                    },
                    {
                        "semester": 2,
                        "count": 5
                    }
                ],
                "deadlines": [
                    {
                        "deadlineTime": "2023-12-31T00:00:00Z",
                        "overdue": true,
                        "count": 1
                    },
                    {
                        "deadlineTime": "2024-12-31T00:00:00Z",
                        "overdue": false,
                        "count": 2
                    }
                ]
            }
            """;
    }

    private DashboardResponse response() {
        return DashboardResponse.builder()
            .pendingCount(5L)
            .overdueCount(2L)
            .types(List.of(
                DashboardResponse.TypeFrequency.builder()
                    .type(AssignmentType.REPORT)
                    .count(3L)
                    .build(),
                DashboardResponse.TypeFrequency.builder()
                    .type(AssignmentType.HOMEWORK)
                    .count(7L)
                    .build()
            ))
            .semesters(List.of(
                DashboardResponse.SemesterFrequency.builder()
                    .semester(1)
                    .count(4L)
                    .build(),
                DashboardResponse.SemesterFrequency.builder()
                    .semester(2)
                    .count(5L)
                    .build()
            ))
            .deadlines(List.of(
                DashboardResponse.DeadlineFrequency.builder()
                    .deadlineTime(Instant.parse("2023-12-31T00:00:00.000000000Z"))
                    .overdue(true)
                    .count(1L)
                    .build(),
                DashboardResponse.DeadlineFrequency.builder()
                    .deadlineTime(Instant.parse("2024-12-31T00:00:00.000000000Z"))
                    .overdue(false)
                    .count(2L)
                    .build()
            ))
            .build();
    }

    @Test
    @DisplayName("Should deserialize")
    void scenario_15ed02fe58d24d2f8b3a077d37bcdf234() throws Exception {
        assertThat(tester.parseObject(json())).isEqualTo(response());
    }

    @Test
    @DisplayName("Should serialize")
    void scenario_fff64c98ef864ea4b45c63ddb9cb61be() throws Exception {
        assertThat(tester.write(response())).isEqualToJson(json());
    }

}
