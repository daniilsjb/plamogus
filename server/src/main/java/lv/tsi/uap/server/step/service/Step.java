package lv.tsi.uap.server.step.service;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lv.tsi.uap.server.assignment.service.Assignment;

@Entity
@Getter
@Setter
@Table(indexes = @Index(columnList = "assignment_id, index", unique = true))
public class Step {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
