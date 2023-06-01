package lv.tsi.uap.server.component.course.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class CourseRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private CourseRepository victim;

    @Test
    @DisplayName("Should find course by code when it exists")
    public void scenario_d4a77a4d10ab44b6bcfa78b41de1fb1c() {
        entityManager.persist(Course.builder()
            .id(UUID.fromString("4c0d825f-18ef-4864-9a4e-dba9132bfe04"))
            .code("PTMS")
            .title("Probability Theory and Mathematical Statistics")
            .description("All assignments must be completed in R.")
            .semester(4)
            .build());

        final var actual = victim.findByCode("PTMS");
        assertThat(actual.isPresent()).isTrue();
        assertThat(actual.get().getCode()).isEqualTo("PTMS");
    }

    @Test
    @DisplayName("Should not find course by code when it does not exist")
    public void scenario_21210676e45d4549931f5dbc6ecc3467() {
        entityManager.persist(Course.builder()
            .id(UUID.fromString("4c0d825f-18ef-4864-9a4e-dba9132bfe04"))
            .code("PTMS")
            .title("Probability Theory and Mathematical Statistics")
            .description("All assignments must be completed in R.")
            .semester(4)
            .build());

        final var actual = victim.findByCode("DSA");
        assertThat(actual.isPresent()).isFalse();
    }

}
