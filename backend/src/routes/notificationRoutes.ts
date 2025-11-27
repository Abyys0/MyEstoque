import { Router, Response } from 'express';
import { db, messaging } from '../config/firebase';
import { authenticate, AuthRequest } from '../middlewares/authMiddleware';
import { ApiResponse, Notification } from '../types';

const router = Router();

// Get user notifications
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const snapshot = await db.collection('notifications')
      .where('userId', '==', req.user!.uid)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Notification[];

    res.json({
      success: true,
      data: notifications,
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    } as ApiResponse);
  }
});

// Mark notification as read
router.put('/:id/read', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await db.collection('notifications').doc(req.params.id).update({
      read: true,
    });

    res.json({
      success: true,
      message: 'Notificação marcada como lida',
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    } as ApiResponse);
  }
});

// Mark all as read
router.put('/read-all', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const snapshot = await db.collection('notifications')
      .where('userId', '==', req.user!.uid)
      .where('read', '==', false)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();

    res.json({
      success: true,
      message: 'Todas as notificações marcadas como lidas',
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    } as ApiResponse);
  }
});

// Send push notification (internal use)
export const sendPushNotification = async (
  userId: string,
  title: string,
  body: string,
  data?: any
): Promise<void> => {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const fcmToken = userDoc.data()?.fcmToken;

    if (!fcmToken) {
      console.log('User has no FCM token');
      return;
    }

    await messaging.send({
      token: fcmToken,
      notification: {
        title,
        body,
      },
      data,
    });

    console.log(`Push notification sent to user ${userId}`);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

export default router;
