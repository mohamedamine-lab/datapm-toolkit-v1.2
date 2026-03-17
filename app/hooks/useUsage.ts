'use client';

import { useState, useEffect, useCallback } from 'react';

const FREE_LIMIT = 5; // artifacts per month
const STORAGE_KEY = 'datapm_usage';
const PRO_KEY = 'datapm_pro';

interface UsageData {
  count: number;
  month: string; // YYYY-MM
  timestamps: string[];
}

function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function getUsageData(): UsageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, month: getCurrentMonth(), timestamps: [] };
    const data = JSON.parse(raw) as UsageData;
    // Reset if new month
    if (data.month !== getCurrentMonth()) {
      return { count: 0, month: getCurrentMonth(), timestamps: [] };
    }
    return data;
  } catch {
    return { count: 0, month: getCurrentMonth(), timestamps: [] };
  }
}

function saveUsageData(data: UsageData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Also set cookie for SSR access
  document.cookie = `datapm_usage=${data.count};path=/;max-age=${60 * 60 * 24 * 31};SameSite=Lax`;
}

export function useUsage() {
  const [usage, setUsage] = useState<UsageData>({ count: 0, month: getCurrentMonth(), timestamps: [] });
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    setUsage(getUsageData());
    setIsPro(localStorage.getItem(PRO_KEY) === 'true');
  }, []);

  const remaining = isPro ? Infinity : Math.max(0, FREE_LIMIT - usage.count);
  const isAtLimit = !isPro && usage.count >= FREE_LIMIT;

  const recordUsage = useCallback(() => {
    if (isPro) return true;
    const current = getUsageData();
    if (current.count >= FREE_LIMIT) {
      setShowUpgradeModal(true);
      return false;
    }
    const updated: UsageData = {
      count: current.count + 1,
      month: getCurrentMonth(),
      timestamps: [...current.timestamps, new Date().toISOString()],
    };
    saveUsageData(updated);
    setUsage(updated);
    return true;
  }, [isPro]);

  const checkLimit = useCallback(() => {
    if (isPro) return true;
    const current = getUsageData();
    if (current.count >= FREE_LIMIT) {
      setShowUpgradeModal(true);
      return false;
    }
    return true;
  }, [isPro]);

  // For testing / demo
  const setPro = useCallback((value: boolean) => {
    localStorage.setItem(PRO_KEY, String(value));
    setIsPro(value);
  }, []);

  const resetUsage = useCallback(() => {
    const fresh: UsageData = { count: 0, month: getCurrentMonth(), timestamps: [] };
    saveUsageData(fresh);
    setUsage(fresh);
  }, []);

  return {
    usage,
    remaining,
    isAtLimit,
    isPro,
    showUpgradeModal,
    setShowUpgradeModal,
    recordUsage,
    checkLimit,
    setPro,
    resetUsage,
    FREE_LIMIT,
  };
}
