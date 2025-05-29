module.exports = {
  async seed({ strapi }) {
    try {
      console.log('Starting seed process...');

      // Create a test customer
      const customer = await strapi.entityService.create('api::customer.customer', {
        data: {
          email: 'test@example.com',
          name: 'John Doe',
          orders: [],
          publishedAt: new Date()
        }
      });

      // Create product in English
      const productEN = await strapi.entityService.create('api::product.product', {
        data: {
          title: 'Premium Wireless Headphones',
          description: 'Experience crystal-clear sound with our premium wireless headphones. Featuring advanced noise cancellation, comfortable design, and long battery life.',
          price: 199.99,
          stock: 100,
          available: true,
          locale: 'en',
          features: [
            {
              title: 'Active Noise Cancellation',
              description: 'Block out external noise for an immersive listening experience'
            },
            {
              title: '30-Hour Battery Life',
              description: 'Enjoy your music all day with extended battery life'
            },
            {
              title: 'Premium Sound Quality',
              description: 'High-fidelity audio with deep bass and crisp highs'
            }
          ],
          variants: [
            {
              name: 'Black',
              price: 199.99,
              available: true,
              stock: 50
            },
            {
              name: 'White',
              price: 219.99,
              available: true,
              stock: 30
            },
            {
              name: 'Silver',
              price: 229.99,
              available: false,
              stock: 0
            }
          ],
          publishedAt: new Date()
        }
      });

      // Create product in French
      const productFR = await strapi.entityService.create('api::product.product', {
        data: {
          title: 'Casque Sans Fil Premium',
          description: 'Découvrez un son cristallin avec notre casque sans fil premium. Doté d\'une réduction de bruit avancée, d\'un design confortable et d\'une longue autonomie.',
          price: 199.99,
          stock: 100,
          available: true,
          locale: 'fr',
          features: [
            {
              title: 'Réduction Active du Bruit',
              description: 'Bloquez les bruits externes pour une expérience d\'écoute immersive'
            },
            {
              title: '30 Heures d\'Autonomie',
              description: 'Profitez de votre musique toute la journée grâce à une autonomie prolongée'
            },
            {
              title: 'Qualité Audio Premium',
              description: 'Audio haute-fidélité avec des basses profondes et des aigus cristallins'
            }
          ],
          variants: [
            {
              name: 'Noir',
              price: 199.99,
              available: true,
              stock: 50
            },
            {
              name: 'Blanc',
              price: 219.99,
              available: true,
              stock: 30
            },
            {
              name: 'Argent',
              price: 229.99,
              available: false,
              stock: 0
            }
          ],
          publishedAt: new Date()
        }
      });

      // Link the localizations together
      await strapi.entityService.update('api::product.product', productEN.id, {
        data: {
          localizations: [productFR.id]
        }
      });

      await strapi.entityService.update('api::product.product', productFR.id, {
        data: {
          localizations: [productEN.id]
        }
      });

      // Create a test order with variant
      const order = await strapi.entityService.create('api::order.order', {
        data: {
          total: 219.99,
          status: 'completed',
          customer: customer.id,
          stripeSessionId: 'test_session_id',
          shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Test Street',
            city: 'Test City',
            postalCode: '12345',
            country: 'FR'
          },
          items: [
            {
              product: productEN.id,
              variant: productEN.variants[1].id, // White variant
              quantity: 1,
              price: 219.99
            }
          ],
          publishedAt: new Date()
        }
      });

      // Update customer with order
      await strapi.entityService.update('api::customer.customer', customer.id, {
        data: {
          orders: [order.id]
        }
      });

      console.log('✅ Seed completed successfully!');
      console.log('Created:');
      console.log('- 1 Customer');
      console.log('- 1 Order with variant');
      console.log('- 1 Product (with EN and FR translations and variants)');

    } catch (error) {
      console.error('🚫 Error during seed:', error);
      throw error;
    }
  }
}; 