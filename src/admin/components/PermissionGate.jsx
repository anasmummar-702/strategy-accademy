import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function PermissionGate({
  permission,
  children,
  fallback = null,
}) {
  const { hasPermission } = useAdminAuth();

  if (!hasPermission(permission)) {
    return fallback;
  }

  return <>{children}</>;
}
