package lv.tsi.uap.server.component.user.service;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lv.tsi.uap.server.component.assignment.service.Assignment;
import lv.tsi.uap.server.component.course.service.Course;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "_user")
public class User implements UserDetails {

    @Id
    private UUID id;

    @Column(length = 256, unique = true)
    private String email;

    @Column(length = 64, unique = true)
    private String username;

    @Column
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "profile", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Assignment> assignments;

    @OneToMany(mappedBy = "profile", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Course> courses;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
