import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from './storage';

describe('Fluxo Operacional de Sacolinhas e Estoque no Storage', () => {
  beforeEach(() => {
    storage.resetToDefaults();
  });

  it('deve cadastrar um novo produto com localização física inicial como disponível', () => {
    const product = storage.saveProduct({
      name: 'Vestido Jeans Vintage Anos 80',
      category: 'Vestido',
      size: 'P',
      sale_price: 79.9,
      status: 'available',
      storage_location_id: 'loc-2', // Caixa R01
    });

    expect(product.id).toBeDefined();
    expect(product.status).toBe('available');

    const products = storage.getProducts();
    const found = products.find((p) => p.id === product.id);
    expect(found).toBeDefined();
  });

  it('ao adicionar uma peça à sacolinha, o status do produto deve mudar para reserved_bag', () => {
    const available = storage.getProducts().find((p) => p.status === 'available');
    expect(available).toBeDefined();

    // Cria nova cliente para teste
    const newCust = storage.saveCustomer({
      name: 'Tatiana Rocha',
      phone: '(11) 91111-2222',
    });

    // Cria sacolinha
    const bag = storage.createBag(newCust.id);
    expect(bag.items.length).toBe(0);

    // Adiciona peça à sacolinha
    const updatedBag = storage.addItemToBag(bag.id, available!.id);
    expect(updatedBag.items.length).toBe(1);
    expect(updatedBag.total_amount).toBe(available!.sale_price);

    // Verifica que o produto agora está reservado
    const prodInStore = storage.getProducts().find((p) => p.id === available!.id);
    expect(prodInStore?.status).toBe('reserved_bag');
  });

  it('ao remover uma peça da sacolinha, o status do produto deve retornar para available', () => {
    const bags = storage.getBags().filter((b) => b.items.length > 0 && b.status !== 'shipped');
    const targetBag = bags[0];
    const itemToRemove = targetBag.items[0];

    storage.removeItemFromBag(targetBag.id, itemToRemove.id);

    const prodInStore = storage.getProducts().find((p) => p.id === itemToRemove.product_id);
    expect(prodInStore?.status).toBe('available');
  });

  it('ao marcar a sacolinha como enviada, gera uma venda e marca os produtos como vendidos', () => {
    const bags = storage.getBags().filter((b) => b.items.length > 0 && b.status !== 'shipped');
    const targetBag = bags[0];
    const initialSalesCount = storage.getSales().length;

    storage.markBagAsShipped(targetBag.id, 'Pix');

    // Verifica que o status da sacolinha virou shipped
    const updatedBag = storage.getBags().find((b) => b.id === targetBag.id);
    expect(updatedBag?.status).toBe('shipped');

    // Verifica que registrou a venda no financeiro
    const sales = storage.getSales();
    expect(sales.length).toBe(initialSalesCount + 1);
    expect(sales[0].bag_id).toBe(targetBag.id);
    expect(sales[0].total_amount).toBe(targetBag.total_amount);

    // Verifica que os produtos ficaram com status 'sold'
    const products = storage.getProducts();
    targetBag.items.forEach((item) => {
      const p = products.find((prod) => prod.id === item.product_id);
      expect(p?.status).toBe('sold');
    });
  });
});
