package lv.tsi.uap.server.component.step.service;

import jakarta.persistence.*;
import lombok.*;
import lv.tsi.uap.server.component.assignment.service.Assignment;

import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(indexes = @Index(columnList = "assignment_id, index", unique = true))
public class Step {

    @Id
    private UUID id;

    @Column(nullable = false, length = 64)
    private String title;

    @Column(nullable = false)
    private Boolean completed = false;

    @Column(nullable = false)
    private Integer index;

    @ManyToOne
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

}
