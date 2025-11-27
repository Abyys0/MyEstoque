import cron from 'node-cron';
import { db } from '../config/firebase';
import { sendPushNotification } from '../routes/notificationRoutes';
import { NotificationType } from '../types';

export const startScheduledJobs = (): void => {
  // Check low stock daily at 9 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running low stock check...');
    await checkLowStock();
  });

  // Check expiring products daily at 10 AM
  cron.schedule('0 10 * * *', async () => {
    console.log('Running expiry check...');
    await checkExpiringProducts();
  });

  // Check products with no movement weekly (Monday at 11 AM)
  cron.schedule('0 11 * * 1', async () => {
    console.log('Running no movement check...');
    await checkNoMovement();
  });

  console.log('✅ Scheduled jobs started');
};

// Check for low stock products
const checkLowStock = async (): Promise<void> => {
  try {
    const snapshot = await db.collection('products').get();
    const lowStockProducts = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((p: any) => p.currentStock <= p.minStock);

    if (lowStockProducts.length === 0) return;

    // Get all admin users
    const usersSnapshot = await db.collection('users')
      .where('role', '==', 'admin')
      .where('isActive', '==', true)
      .get();

    // Create notifications and send push
    for (const product of lowStockProducts) {
      const notification = {
        type: NotificationType.LOW_STOCK,
        title: 'Estoque Baixo',
        message: `${(product as any).name} está com estoque baixo (${(product as any).currentStock} ${(product as any).unit})`,
        productId: (product as any).id,
        read: false,
        createdAt: new Date(),
      };

      // Save notification and send push to each admin
      for (const userDoc of usersSnapshot.docs) {
        await db.collection('notifications').add({
          ...notification,
          userId: userDoc.id,
        });

        await sendPushNotification(
          userDoc.id,
          notification.title,
          notification.message,
          { productId: (product as any).id, type: 'low_stock' }
        );
      }
    }

    console.log(`✅ Sent ${lowStockProducts.length} low stock alerts`);
  } catch (error) {
    console.error('Error checking low stock:', error);
  }
};

// Check for expiring products
const checkExpiringProducts = async (): Promise<void> => {
  try {
    const daysWarning = parseInt(process.env.EXPIRY_WARNING_DAYS || '30');
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + daysWarning);

    const snapshot = await db.collection('products')
      .where('expiryDate', '<=', warningDate)
      .where('expiryDate', '>=', new Date())
      .get();

    if (snapshot.empty) return;

    const expiringProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get all admin and operator users
    const usersSnapshot = await db.collection('users')
      .where('isActive', '==', true)
      .get();

    const adminsAndOperators = usersSnapshot.docs.filter(doc => {
      const role = doc.data().role;
      return role === 'admin' || role === 'operator';
    });

    // Create notifications and send push
    for (const product of expiringProducts) {
      const expiryDate = (product as any).expiryDate.toDate();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

      const notification = {
        type: NotificationType.EXPIRY_WARNING,
        title: 'Validade Próxima',
        message: `${(product as any).name} vence em ${daysUntilExpiry} dias`,
        productId: (product as any).id,
        read: false,
        createdAt: new Date(),
      };

      for (const userDoc of adminsAndOperators) {
        await db.collection('notifications').add({
          ...notification,
          userId: userDoc.id,
        });

        await sendPushNotification(
          userDoc.id,
          notification.title,
          notification.message,
          { productId: (product as any).id, type: 'expiry_warning' }
        );
      }
    }

    console.log(`✅ Sent ${expiringProducts.length} expiry warnings`);
  } catch (error) {
    console.error('Error checking expiring products:', error);
  }
};

// Check for products with no movement
const checkNoMovement = async (): Promise<void> => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const productsSnapshot = await db.collection('products').get();
    const productsWithNoMovement = [];

    for (const productDoc of productsSnapshot.docs) {
      const movementsSnapshot = await db.collection('stock_movements')
        .where('productId', '==', productDoc.id)
        .where('timestamp', '>=', thirtyDaysAgo)
        .limit(1)
        .get();

      if (movementsSnapshot.empty) {
        productsWithNoMovement.push({
          id: productDoc.id,
          ...productDoc.data(),
        });
      }
    }

    if (productsWithNoMovement.length === 0) return;

    // Get all admin users
    const usersSnapshot = await db.collection('users')
      .where('role', '==', 'admin')
      .where('isActive', '==', true)
      .get();

    // Create notifications
    for (const product of productsWithNoMovement) {
      const notification = {
        type: NotificationType.NO_MOVEMENT,
        title: 'Produto Sem Movimentação',
        message: `${(product as any).name} não teve movimentação nos últimos 30 dias`,
        productId: (product as any).id,
        read: false,
        createdAt: new Date(),
      };

      for (const userDoc of usersSnapshot.docs) {
        await db.collection('notifications').add({
          ...notification,
          userId: userDoc.id,
        });

        await sendPushNotification(
          userDoc.id,
          notification.title,
          notification.message,
          { productId: (product as any).id, type: 'no_movement' }
        );
      }
    }

    console.log(`✅ Sent ${productsWithNoMovement.length} no movement alerts`);
  } catch (error) {
    console.error('Error checking no movement:', error);
  }
};
