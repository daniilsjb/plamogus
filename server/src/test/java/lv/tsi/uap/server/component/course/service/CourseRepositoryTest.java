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
    public void shouldFindCourseByCode() {
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
    public void shouldNotFindCourseByCode() {
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
