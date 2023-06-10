package lv.tsi.plamogus.server.component.step.service;

import lv.tsi.plamogus.server.component.assignment.service.Assignment;
import lv.tsi.plamogus.server.component.assignment.service.AssignmentRepository;
import lv.tsi.plamogus.server.component.step.endpoint.StepQuery;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Supplier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DefaultStepServiceTest {

    @Mock
    private StepRepository repository;

    @Mock
    private AssignmentRepository assignmentRepository;

    @Mock
    private Supplier<UUID> uuidSupplier;

    @InjectMocks
    private DefaultStepService victim;

    @Test
    @DisplayName("Should successfully create a step")
    public void scenario_11a48b37b6ab47229bac833d908dbe8f() {
        final var assignmentId = UUID.fromString("4564a0b9-ddce-456f-a46b-22946413f1c3");
        final var stepId = UUID.fromString("ab519b31-f5e3-410f-9dc5-52295942c483");

        final var entity = Step.builder()
            .title("Sample step")
            .assignment(Assignment.builder()
                .id(assignmentId)
                .build())
            .build();

        when(assignmentRepository.existsById(assignmentId)).thenReturn(true);
        when(repository.findLastIndex(assignmentId)).thenReturn(Optional.of(3));

        when(uuidSupplier.get()).thenReturn(stepId);

        victim.create(entity);

        assertThat(entity.getId()).isEqualTo(stepId);
        assertThat(entity.getIndex()).isEqualTo(4);
        assertThat(entity.getCompleted()).isFalse();

        verify(assignmentRepository).existsById(assignmentId);
        verify(repository).findLastIndex(assignmentId);
        verify(repository).save(entity);
        verify(uuidSupplier).get();
    }

    @Test
    @DisplayName("Should successfully save a step when the assignment has no other steps")
    public void scenario_98a378c0d76b42dca67156dbdcf67b11() {
        final var assignmentId = UUID.fromString("4564a0b9-ddce-456f-a46b-22946413f1c3");
        final var stepId = UUID.fromString("ab519b31-f5e3-410f-9dc5-52295942c483");

        final var entity = Step.builder()
            .title("Sample step")
            .assignment(Assignment.builder()
                .id(assignmentId)
                .build())
            .build();

        when(assignmentRepository.existsById(assignmentId)).thenReturn(true);
        when(repository.findLastIndex(assignmentId)).thenReturn(Optional.empty());
        when(uuidSupplier.get()).thenReturn(stepId);

        victim.create(entity);

        assertThat(entity.getId()).isEqualTo(stepId);
        assertThat(entity.getIndex()).isEqualTo(0);
        assertThat(entity.getCompleted()).isFalse();

        verify(assignmentRepository).existsById(assignmentId);
        verify(repository).findLastIndex(assignmentId);
        verify(repository).save(entity);
        verify(uuidSupplier).get();
    }

    @Test
    @DisplayName("Should successfully return steps belong to an assignment")
    public void scenario_585b58f10d6642958d42fe0ecbc23b61() {
        final var assignmentId = UUID.fromString("4564a0b9-ddce-456f-a46b-22946413f1c3");

        final var step1Id = UUID.fromString("d5073d42-da73-48a8-bfcb-b9d2f0c82004");
        final var step2Id = UUID.fromString("6c093cb3-2359-40a3-a714-715a75f1c903");
        final var step3Id = UUID.fromString("bf37d5b9-81a8-4c46-86e2-daccf32793bd");

        final var entities = List.of(
            Step.builder().id(step1Id).build(),
            Step.builder().id(step2Id).build(),
            Step.builder().id(step3Id).build()
        );

        when(assignmentRepository.existsById(assignmentId)).thenReturn(true);
        when(repository.findByAssignmentIdOrderByIndex(assignmentId)).thenReturn(entities);

        final var result = victim.findAll(new StepQuery(assignmentId));

        assertThat(result.size()).isEqualTo(3);
        assertThat(result.get(0).getId()).isEqualTo(step1Id);
        assertThat(result.get(1).getId()).isEqualTo(step2Id);
        assertThat(result.get(2).getId()).isEqualTo(step3Id);

        verify(assignmentRepository).existsById(assignmentId);
        verify(repository).findByAssignmentIdOrderByIndex(assignmentId);
    }

    @Test
    @DisplayName("Should throw an exception when trying to find steps belonging to a non-existent assignment")
    public void scenario_8072e9a0696a4cc7aff148eea8db1d82() {
        final var assignmentId = UUID.fromString("4564a0b9-ddce-456f-a46b-22946413f1c3");

        when(assignmentRepository.existsById(assignmentId)).thenReturn(false);

        assertThatThrownBy(() -> victim.findAll(new StepQuery(assignmentId)))
            .isInstanceOf(ResponseStatusException.class);

        verify(assignmentRepository).existsById(assignmentId);
    }

    @Test
    @DisplayName("Should throw an exception when trying to add a step to assignment that does not exist")
    public void scenario_35451a77e385444599601711124fec92() {
        final var assignmentId = UUID.fromString("4564a0b9-ddce-456f-a46b-22946413f1c3");

        final var entity = Step.builder()
            .title("Sample step")
            .completed(false)
            .assignment(Assignment.builder()
                .id(assignmentId)
                .build())
            .build();

        when(assignmentRepository.existsById(assignmentId)).thenReturn(false);

        assertThatThrownBy(() -> victim.create(entity))
            .isInstanceOf(ResponseStatusException.class);

        verify(assignmentRepository).existsById(assignmentId);
    }

    @Test
    @DisplayName("Should successfully update a step")
    public void scenario_b1f02094997a4d2db7a056aa0bd2e49a() {
        final var id = UUID.fromString("4564a0b9-ddce-456f-a46b-22946413f1c3");
        final var entity = Step.builder()
            .id(id)
            .title("Sample step")
            .completed(false)
            .build();

        when(repository.findById(id)).thenReturn(Optional.of(entity));

        victim.update(entity);

        verify(repository).findById(id);
        verify(repository).save(entity);
    }

    @Test
    @DisplayName("Should throw an exception when trying to update a step that does not exist")
    public void scenario_253ef0d6298f4c53b2a8c3984f9454fb() {
        final var id = UUID.fromString("4564a0b9-ddce-456f-a46b-22946413f1c3");
        final var entity = Step.builder()
            .id(id)
            .title("Sample step")
            .completed(false)
            .build();

        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> victim.update(entity))
            .isInstanceOf(ResponseStatusException.class);

        verify(repository).findById(id);
    }

    @Test
    @DisplayName("Should successfully delete a step")
    public void scenario_f23ca603950d49bebbb8bdf620103b17() {
        final var id = UUID.fromString("4564a0b9-ddce-456f-a46b-22946413f1c3");
        final var assignmentId = UUID.fromString("ed1a2e1f-0827-4ba4-989c-e2c33b2597d3");

        final var entity = Step.builder()
            .id(id)
            .title("Step #1")
            .completed(false)
            .index(3)
            .assignment(Assignment.builder()
                .id(assignmentId)
                .build())
            .build();

        when(repository.findById(id)).thenReturn(Optional.of(entity));

        victim.delete(id);

        verify(repository).findById(id);
        verify(repository).deleteById(id);
        verify(repository).updateIndices(assignmentId, 3);
    }

    @Test
    @DisplayName("Should do nothing when deleting a step that does not exist")
    public void scenario_a8abf03c62314ab3b49ae49d710ba2cb() {
        final var id = UUID.fromString("4564a0b9-ddce-456f-a46b-22946413f1c3");

        when(repository.findById(id)).thenReturn(Optional.empty());

        victim.delete(id);

        verify(repository).findById(id);
        verify(repository, never()).deleteById(id);
    }

    @Test
    @DisplayName("Should perform a save when completing a step that exists")
    public void scenario_d644e4b055fe446281f5b114bc7aa221() {
        final var entity = Step.builder()
            .id(UUID.fromString("1fd88260-552f-4741-921a-660a8fca0f7e"))
            .title("Sample step")
            .completed(false)
            .build();

        when(repository.findById(entity.getId())).thenReturn(Optional.of(entity));

        victim.complete(entity.getId());

        verify(repository).findById(entity.getId());
        verify(repository).save(entity);
    }

    @Test
    @DisplayName("Should throw an exception when completing a step that does not exist")
    public void scenario_7780ec3952284ba096ca2ee12656e857() {
        final var id = UUID.fromString("1fd88260-552f-4741-921a-660a8fca0f7e");

        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> victim.complete(id))
            .isInstanceOf(ResponseStatusException.class);

        verify(repository).findById(id);
    }

    @Test
    @DisplayName("Should perform a save when un-completing a step that exists")
    public void scenario_1d9b90600f064d5c8ee167fb3b2cd581() {
        final var entity = Step.builder()
            .id(UUID.fromString("1fd88260-552f-4741-921a-660a8fca0f7e"))
            .title("Sample step")
            .completed(false)
            .build();

        when(repository.findById(entity.getId())).thenReturn(Optional.of(entity));

        victim.uncomplete(entity.getId());

        verify(repository).findById(entity.getId());
        verify(repository).save(entity);
    }

    @Test
    @DisplayName("Should throw an exception when un-completing a step that does not exist")
    public void scenario_dba9d36b1adf422a9faa74b438830211() {
        final var id = UUID.fromString("1fd88260-552f-4741-921a-660a8fca0f7e");

        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> victim.uncomplete(id))
            .isInstanceOf(ResponseStatusException.class);

        verify(repository).findById(id);
    }

}
