"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : null;
}

const DashboardContent = () => {
     const router = useRouter();
      const [balance, setBalance] = useState<number | null>(null);
      const [transactions, setTransactions] = useState<any[]>([]);
      const [amount, setAmount] = useState<string>("");
      const [description, setDescription] = useState<string>("");
      const [loading, setLoading] = useState<boolean>(false);
    
      const token = useMemo(() => getCookie("access_token"), []);
      const userId = useMemo(() => getCookie("user_id"), []);
    
    
      const authHeaders = useMemo(
        () => ({ Authorization: token ? `Bearer ${token}` : "" }),
        [token]
      );
    
      const fetchData = async () => {
        try {
          setLoading(true);
          const [balRes, txRes] = await Promise.all([
            axios.get(`http://localhost:3002/transactions/balance`, { headers: authHeaders }),
            axios.get(`http://localhost:3002/transactions`, { headers: authHeaders }),
          ]);
          setBalance(balRes.data?.balance ?? balRes.data ?? null);
          setTransactions(Array.isArray(txRes.data) ? txRes.data : txRes.data?.transactions ?? []);
        } catch (err: any) {
          const message = err?.response?.data?.error || err?.message || "Failed to load data";
          alert(message);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        if (!token) return;
        fetchData();
      }, [token]);
    
      const fundAccount = async () => {
        try {
          if (!userId) {
            alert("Missing user_id. Please login again.");
            return;
          }
          const amt = Number(amount);
          if (!amt || amt <= 0) {
            alert("Enter a valid amount");
            return;
          }
    
    
          await axios.post(`http://localhost:3002/webhook/fund`, {
            userId: Number(userId),
            amount: amt,
            description: description || `Funding of ${amt}`,
          });
          alert("Funding successful");
          setAmount("");
          setDescription("");
          fetchData();
        } catch (err: any) {
          const message = err?.response?.data?.error || err?.message || "Funding failed";
          alert(message);
        }
      };
    
      const logout = () => {
        // Clear cookies and redirect to login onclick of the logout button
        document.cookie = "access_token=; Max-Age=0; path=/; samesite=lax";
        document.cookie = "user_id=; Max-Age=0; path=/; samesite=lax";
        router.push("/auth/login");
      };


  return (
     <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6 bg-white p-8 rounded-xl shadow">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#008e55]">Dashboard</h1>
          <button
            onClick={logout}
            className="px-3 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 text-sm"
          >
            Logout
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-700">Status: {token ? "Authenticated" : "Not authenticated"}</p>
          <p className="text-sm text-gray-700">Balance: {balance === null ? (loading ? "Loading..." : "-") : balance}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-medium text-[#008e55]">Fund Account</h2>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="flex-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="flex-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={fundAccount}
              className="px-3 py-2 rounded-lg text-white bg-[#008e55] hover:bg-[#00754a] text-sm"
            >
              Fund
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-medium text-[#008e55]">Transactions</h2>
          {!loading && transactions.length === 0 && (
            <p className="text-sm text-gray-500">No transactions found.</p>
          )}
          {loading && <p className="text-sm text-gray-500">Loading transactions...</p>}
          <ul className="divide-y divide-gray-200 rounded-lg border">
            {transactions.map((t: any, idx: number) => (
              <li key={t.id ?? idx} className="p-3 text-sm flex items-center justify-between">
                <span>{t.description ?? t.type ?? "Transaction"}</span>
                <span className="font-medium">{t.amount ?? t.value ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DashboardContent