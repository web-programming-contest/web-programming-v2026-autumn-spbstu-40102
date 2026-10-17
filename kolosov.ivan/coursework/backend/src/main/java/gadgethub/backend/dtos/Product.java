package gadgethub.backend.dtos;


import java.util.Map;
import java.util.Set;

public record Product(Long id, String title, Long price, String text, Map<String, String> specs, String image, Float stars, Set<String> labels, String type, String colour) {
}
