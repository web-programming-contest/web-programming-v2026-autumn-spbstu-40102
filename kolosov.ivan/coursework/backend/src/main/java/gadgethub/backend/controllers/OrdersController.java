package gadgethub.backend.controllers;

import gadgethub.backend.dtos.LoginRequest;
import gadgethub.backend.dtos.NewOrder;
import gadgethub.backend.dtos.OrderSummary;
import gadgethub.backend.service.OrdersService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping ("/api/orders")
public class OrdersController {
    private final OrdersService ordersService;

    public OrdersController(OrdersService ordersService) { this.ordersService = ordersService; }

    @PostMapping("/new")
    public Long postNewOrder(@RequestBody NewOrder newOrder) {
        return ordersService.postNewOrder(newOrder);
    }

    @GetMapping("/{clientId}")
    public List<OrderSummary> getClientsOrders(@PathVariable Long clientId) {
        return ordersService.getClientsOrders(clientId);
    }
}
