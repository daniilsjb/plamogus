package lv.tsi.plamogus.server.component.assignment.service;

import lv.tsi.plamogus.server.component.course.service.Course;
import lv.tsi.plamogus.server.component.course.service.CourseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Supplier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DefaultAssignmentServiceTest {

    @Mock
    private AssignmentRepository repository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private Supplier<UUID> uuidSupplier;

    @Mock
    private Supplier<Instant> instantSupplier;

    private DefaultAssignmentService victim;

    @BeforeEach
    public void setUp() {
        // We have to inject mocks manually due to type erasure, otherwise both suppliers would end up being the same.
        this.victim = new DefaultAssignmentService(repository, courseRepository, uuidSupplier, instantSupplier);
    }

    @Test
    @DisplayName("Should successfully create an assignment")
    public void scenario_54b53478d612411dae9a084da6305ac7() {
        final var entity = Assignment.builder()
            .title("Something")
            .build();

        final var id = UUID.fromString("0efa57ad-93e6-4bde-bf06-67e97a970281");

        when(uuidSupplier.get()).thenReturn(id);
        when(instantSupplier.get()).thenReturn(Instant.EPOCH);

        victim.create(entity);

        assertThat(entity.getId()).isEqualTo(id);
        assertThat(entity.getCreationTime()).isEqualTo(Instant.EPOCH);
        assertThat(entity.getCompleted()).isFalse();

        verify(uuidSupplier).get();
        verify(instantSupplier).get();
        verify(repository).save(entity);
    }

    @Test
    @DisplayName("Should throw an exception when trying to create an assignment attached to a non-existent course")
    public void scenario_3a2e5beff243451eb2be0b1ed4ca32db() {
        final var courseId = UUID.fromString("7699b87f-4ff4-47c6-829c-bdbaf50ac2da");
        final var entity = Assignment.builder()
            .title("Something")
            .course(Course.builder()
                .id(courseId)
                .build())
            .build();

        when(courseRepository.existsById(courseId)).thenReturn(false);

        assertThatThrownBy(() -> victim.create(entity))
            .isInstanceOf(ResponseStatusException.class);

        verify(courseRepository).existsById(courseId);
        verify(repository, never()).save(entity);
    }

    @Test
    @DisplayName("Should successfully update an assignment that already exists")
    public void scenario_4e5036e36817426494df19049d3dbbfc() {
        final var id = UUID.fromString("4564a0b9-ddce-456f-a46b-22946413f1c3");
        final var entity = Assignment.builder()
            .id(id)
            .title("Something")
            .completed(true)
            .creationTime(Instant.EPOCH)
            .build();

        when(repository.findById(id)).thenReturn(Optional.of(entity));

        victim.update(entity);

        assertThat(entity.getId()).isEqualTo(id);
        assertThat(entity.getCompleted()).isTrue();
        assertThat(entity.getCreationTime()).isEqualTo(Instant.EPOCH);

        verify(instantSupplier, never()).get();
        verify(repository).findById(id);
        verify(repository).save(entity);
    }

    @Test
    @DisplayName("Should successfully update an assignment that did not exist")
    public void scenario_7a84af7c53194999ad75aefe9f9a71a3() {
        final var id = UUID.fromString("4564a0b9-ddce-456f-a46b-22946413f1c3");
        final var entity = Assignment.builder()
            .id(id)
            .title("Something")
            .build();

        when(repository.findById(id)).thenReturn(Optional.empty());
        when(repository.save(entity)).thenReturn(entity);

        when(instantSupplier.get()).thenReturn(Instant.EPOCH);

        victim.update(entity);

        assertThat(entity.getId()).isEqualTo(id);
        assertThat(entity.getCompleted()).isFalse();
        assertThat(entity.getCreationTime()).isEqualTo(Instant.EPOCH);

        verify(instantSupplier).get();
        verify(repository).findById(id);
        verify(repository).save(entity);
    }

    @Test
    @DisplayName("Should throw an exception when updating an assignment with a non-existent course")
    public void scenario_8d056b2271054a87beaf807cd869db70() {
        final var courseId = UUID.fromString("78464eca-7a7a-4c86-8cee-6499645baace");
        final var entity = Assignment.builder()
            .id(UUID.fromString("4564a0b9-ddce-456f-a46b-22946413f1c3"))
            .title("Something")
            .course(Course.builder()
                .id(courseId)
                .build())
            .build();

        when(courseRepository.existsById(courseId)).thenReturn(false);

        assertThatThrownBy(() -> victim.update(entity))
            .isInstanceOf(ResponseStatusException.class);

        verify(courseRepository).existsById(courseId);
        verify(repository, never()).save(entity);
    }

    @Test
    @DisplayName("Calls to delete are propagated to the repository")
    public void scenario_b04b75aba21e4d35bb4ef3bf70033df8() {
        final var id = UUID.fromString("4564a0b9-ddce-456f-a46b-22946413f1c3");

        victim.delete(id);

        verify(repository).deleteById(id);
    }

    @Test
    @DisplayName("Should perform a save when completing an assignment that exists")
    public void scenario_8a99b7a69a164c19a40d115b1b47e0ac() {
        final var assignment = Assignment.builder()
            .id(UUID.fromString("1fd88260-552f-4741-921a-660a8fca0f7e"))
            .title("Sample step")
            .completed(false)
            .build();

        when(repository.findById(assignment.getId())).thenReturn(Optional.of(assignment));

        victim.complete(assignment.getId());

        verify(repository).findById(assignment.getId());
        verify(repository).save(assignment);
    }

    @Test
    @DisplayName("Should throw an exception when completing an assignment that does not exist")
    public void scenario_43b497065d49485fbe1edf7015b8c8f7() {
        final var id = UUID.fromString("1fd88260-552f-4741-921a-660a8fca0f7e");

        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> victim.complete(id))
            .isInstanceOf(ResponseStatusException.class);

        verify(repository).findById(id);
    }

    @Test
    @DisplayName("Should perform a save when un-completing an assignment that exists")
    public void scenario_1ac96474c46541d1936a72e29df86356() {
        final var assignment = Assignment.builder()
            .id(UUID.fromString("1fd88260-552f-4741-921a-660a8fca0f7e"))
            .title("Sample step")
            .completed(false)
            .build();

        when(repository.findById(assignment.getId())).thenReturn(Optional.of(assignment));

        victim.uncomplete(assignment.getId());

        verify(repository).findById(assignment.getId());
        verify(repository).save(assignment);
    }

    @Test
    @DisplayName("Should throw an exception when un-completing an assignment that does not exist")
    public void scenario_0152706ca7a141f49469863a4eae75a8() {
        final var id = UUID.fromString("1fd88260-552f-4741-921a-660a8fca0f7e");

        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> victim.uncomplete(id))
            .isInstanceOf(ResponseStatusException.class);

        verify(repository).findById(id);
    }

}
