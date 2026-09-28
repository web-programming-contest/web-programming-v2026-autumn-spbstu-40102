package gadgethub.backend.service;

import gadgethub.backend.dtos.NewOrder;
import gadgethub.backend.dtos.OrderSummary;
import gadgethub.backend.repostories.OrdersRepository;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

@Service
public class OrdersService {
    private final OrdersRepository ordersRepository;

    public OrdersService(OrdersRepository ordersRepository) { this.ordersRepository = ordersRepository; }

    public Long postNewOrder(NewOrder newOrder) {
        try {
            return ordersRepository.insertNewOrder(newOrder);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public List<OrderSummary> getClientsOrders(Long clientId) {
        try {
            return ordersRepository.getOrderSummaryListForClient(clientId);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
