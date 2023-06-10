package lv.tsi.plamogus.server.component.step.service;

import lv.tsi.plamogus.server.component.assignment.service.Assignment;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class StepRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private StepRepository victim;

    @Test
    @DisplayName("Should find index of the last step of an assignment")
    public void scenario_16ee15edefa647a596ef59d5419be7b0() {
        final var assignmentA = Assignment.builder()
            .id(UUID.fromString("6890e06c-2437-4c41-9f1e-156968952d59"))
            .title("Programming Lab #1")
            .creationTime(Instant.EPOCH)
            .completed(false)
            .build();

        final var assignmentB = Assignment.builder()
            .id(UUID.fromString("cb7651bd-abcb-46b8-ad9d-34bee5d21c3f"))
            .title("Programming Lab #2")
            .creationTime(Instant.EPOCH)
            .completed(false)
            .build();

        final var stepA = Step.builder()
            .id(UUID.fromString("992b4654-164f-4931-82c7-25475486ff29"))
            .title("Lab #1 / Step #3")
            .completed(true)
            .index(0)
            .assignment(assignmentA)
            .build();

        final var stepB = Step.builder()
            .id(UUID.fromString("878c229a-2763-4292-afab-ec813ef8c699"))
            .title("Lab #1 / Step #2")
            .completed(false)
            .index(1)
            .assignment(assignmentA)
            .build();

        final var stepC = Step.builder()
            .id(UUID.fromString("cd9aec35-f280-4601-8a8e-148a59c55d06"))
            .title("Lab #1 / Step #1")
            .completed(false)
            .index(2)
            .assignment(assignmentA)
            .build();

        final var stepD = Step.builder()
            .id(UUID.fromString("bf8d5539-e836-4d28-9101-77218567047c"))
            .title("Lab #2 / Step #1")
            .completed(false)
            .index(5)
            .assignment(assignmentB)
            .build();

        entityManager.persist(assignmentA);
        entityManager.persist(assignmentB);

        entityManager.persist(stepA);
        entityManager.persist(stepB);
        entityManager.persist(stepC);
        entityManager.persist(stepD);

        final var actualA = victim.findLastIndex(assignmentA.getId());
        assertThat(actualA.isPresent()).isTrue();
        assertThat(actualA.get()).isEqualTo(2);

        final var actualB = victim.findLastIndex(assignmentB.getId());
        assertThat(actualB.isPresent()).isTrue();
        assertThat(actualB.get()).isEqualTo(5);
    }

    @Test
    @DisplayName("Should not find the last index of a step when assignment has no steps")
    public void scenario_2385f0a16c7549b298488ca06d554fec() {
        final var assignment = Assignment.builder()
            .id(UUID.fromString("6890e06c-2437-4c41-9f1e-156968952d59"))
            .title("Programming Lab #1")
            .creationTime(Instant.EPOCH)
            .completed(false)
            .build();

        entityManager.persist(assignment);

        final var actual = victim.findLastIndex(assignment.getId());
        assertThat(actual.isPresent()).isFalse();
    }

    @Test
    @DisplayName("Should not find the last index of a step when assignment does not exist")
    public void scenario_bc5bb64c2b6241c9afaad1073266a153() {
        final var actual = victim.findLastIndex(UUID.fromString("09cff166-487a-4f97-b49a-fe06a16bcd34"));
        assertThat(actual.isPresent()).isFalse();
    }

    @Test
    @DisplayName("Should find all steps belonging to an assignment")
    public void scenario_ad135a376e2e458cbb091e6bf1483380() {
        final var assignmentA = Assignment.builder()
            .id(UUID.fromString("6890e06c-2437-4c41-9f1e-156968952d59"))
            .title("Programming Lab #1")
            .creationTime(Instant.EPOCH)
            .completed(false)
            .build();

        final var assignmentB = Assignment.builder()
            .id(UUID.fromString("cb7651bd-abcb-46b8-ad9d-34bee5d21c3f"))
            .title("Programming Lab #2")
            .creationTime(Instant.EPOCH)
            .completed(false)
            .build();

        final var stepA = Step.builder()
            .id(UUID.fromString("992b4654-164f-4931-82c7-25475486ff29"))
            .title("Lab # 1 / Step #3")
            .completed(true)
            .index(2)
            .assignment(assignmentA)
            .build();

        final var stepB = Step.builder()
            .id(UUID.fromString("878c229a-2763-4292-afab-ec813ef8c699"))
            .title("Lab #1 / Step #2")
            .completed(false)
            .index(1)
            .assignment(assignmentA)
            .build();

        final var stepC = Step.builder()
            .id(UUID.fromString("cd9aec35-f280-4601-8a8e-148a59c55d06"))
            .title("Lab #1 / Step #1")
            .completed(false)
            .index(0)
            .assignment(assignmentA)
            .build();

        final var stepD = Step.builder()
            .id(UUID.fromString("bf8d5539-e836-4d28-9101-77218567047c"))
            .title("Lab #2 / Step #1")
            .completed(false)
            .index(0)
            .assignment(assignmentB)
            .build();

        entityManager.persist(assignmentA);
        entityManager.persist(assignmentB);

        entityManager.persist(stepA);
        entityManager.persist(stepB);
        entityManager.persist(stepC);
        entityManager.persist(stepD);

        final var actual = victim.findByAssignmentIdOrderByIndex(assignmentA.getId());

        // Result order is different from insertion order.
        assertThat(actual.size()).isEqualTo(3);
        assertThat(actual.get(2).getId()).isEqualTo(stepA.getId());
        assertThat(actual.get(1).getId()).isEqualTo(stepB.getId());
        assertThat(actual.get(0).getId()).isEqualTo(stepC.getId());
    }

    @Test
    @DisplayName("Should return empty list when searching for steps of a non-existent assignment")
    public void scenario_43306ba737e448a2b2c8774d14327dc9() {
        final var actual = victim.findByAssignmentIdOrderByIndex(
            UUID.fromString("053d9c16-39db-4c91-83bf-c0ab338dd51c")
        );
        assertThat(actual.isEmpty()).isTrue();
    }

}
