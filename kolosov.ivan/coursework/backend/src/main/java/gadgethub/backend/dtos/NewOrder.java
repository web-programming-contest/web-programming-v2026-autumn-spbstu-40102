package gadgethub.backend.dtos;

public record NewOrder(
        Long clientId, String products, Long productsAmount, Long totalPrice, String email,
        String phone, String address, Boolean isCash, Boolean isPackagingRequired) {
}
