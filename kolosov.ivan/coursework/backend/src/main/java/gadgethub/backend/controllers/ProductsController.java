package gadgethub.backend.controllers;

import gadgethub.backend.dtos.Product;
import gadgethub.backend.service.ProductsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping ("/api/products")
public class ProductsController {
    private final ProductsService productsService;

    public ProductsController(ProductsService productsService) { this.productsService = productsService; }

    @GetMapping("/{label}")
    public List<Product> getAllProductsWithLabel(@PathVariable String label) {
        return productsService.getAllProductsWithLabel(label);
    }

    @GetMapping("")
    public List<Product> getAllProducts() {
        return productsService.getAllProducts();
    }

    @GetMapping("/max-price")
    public Long getMaxPrice() {
        return productsService.getMaxPrice();
    }
}
