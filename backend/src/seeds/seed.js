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

      // Create a test order
      const order = await strapi.entityService.create('api::order.order', {
        data: {
          total: 199.99,
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
          publishedAt: new Date()
        }
      });

      // Update customer with order
      await strapi.entityService.update('api::customer.customer', customer.id, {
        data: {
          orders: [order.id]
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

      // Update order with product reference
      await strapi.entityService.update('api::order.order', order.id, {
        data: {
          product: productEN.id
        }
      });

      // Create example order
      await strapi.entityService.create('api::order.order', {
        data: {
          total: 199.99,
          status: 'completed',
          stripeSessionId: 'cs_test_example123',
          customerEmail: 'john.doe@example.com',
          customerName: 'John Doe',
          shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main Street',
            city: 'New York',
            postalCode: '10001',
            country: 'US'
          }
        }
      });

      console.log('✅ Seed completed successfully!');
      console.log('Created:');
      console.log('- 1 Customer');
      console.log('- 1 Order');
      console.log('- 1 Product (with EN and FR translations)');
      console.log('- Example order');

    } catch (error) {
      console.error('🚫 Error during seed:', error);
      throw error;
    }
  }
}; 