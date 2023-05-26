package lv.tsi.uap.server.common.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    public String createToken(UserDetails user, Map<String, Object> claims) {
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(user.getUsername())
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24))
            .signWith(createSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    public String createToken(UserDetails user) {
        return createToken(user, new HashMap<>());
    }

    public String extractUsername(String jwt) {
        return extractAllClaims(jwt).getSubject();
    }

    public Boolean hasTokenExpired(String jwt) {
        final var expirationDate = extractAllClaims(jwt).getExpiration();
        return expirationDate.before(new Date());
    }

    private Claims extractAllClaims(String jwt) {
        return Jwts.parserBuilder()
            .setSigningKey(createSigningKey())
            .build()
            .parseClaimsJws(jwt)
            .getBody();
    }

    private Key createSigningKey() {
        final var bytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(bytes);
    }

}
