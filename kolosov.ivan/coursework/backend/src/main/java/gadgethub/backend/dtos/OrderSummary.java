package gadgethub.backend.dtos;

import java.sql.Timestamp;

public record OrderSummary(Long id, Long productsAmount, Long totalPrice, String createDate) {
}
