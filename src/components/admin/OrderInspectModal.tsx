'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order } from '@/types/auth';
import { ProductIllustration } from '@/components/ProductIllustrations';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Mail,
  User as UserIcon,
  ExternalLink,
  Ban,
  ShieldCheck,
  Printer,
  Edit3,
  Save,
  Check
} from 'lucide-react';

interface OrderInspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus: (
    orderId: string,
    newStatus: Order['status'],
    extra?: { trackingNumber?: string; carrier?: string }
  ) => void;
}

export const OrderInspectModal: React.FC<OrderInspectModalProps> = ({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
}) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('DHL Carbon-Neutral');
  const [isEditingTracking, setIsEditingTracking] = useState(false);
  const [trackingSaved, setTrackingSaved] = useState(false);

  useEffect(() => {
    if (order) {
      setTrackingNumber(order.trackingNumber || `ES-TRK-${order.orderNumber.replace('ES-', '')}`);
      setCarrier(order.carrier || 'DHL Carbon-Neutral');
      setIsEditingTracking(false);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(order.id, order.status, {
      trackingNumber: trackingNumber.trim(),
      carrier: carrier.trim(),
    });
    setTrackingSaved(true);
    setIsEditingTracking(false);
    setTimeout(() => setTrackingSaved(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Processing</span>
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Truck className="w-3.5 h-3.5" />
            <span>Shipped &amp; In Transit</span>
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-olive/15 text-olive border border-olive/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
            <Ban className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 sticky top-0 bg-surface-lowest z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display-lg text-lg sm:text-xl font-bold text-on-surface">
                Order {order.orderNumber}
              </h2>
              {getStatusBadge(order.status)}
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Placed on {order.date} · Identifier: <span className="font-mono">{order.id}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-high transition-colors"
            title="Close inspection"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Quick Fulfillment Action Bar */}
          <div className="bg-surface-low border border-outline-variant/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-on-surface block">
                Update Fulfillment Lifecycle:
              </span>
              <span className="text-[11px] text-on-surface-variant">
                Changes propagate immediately to the customer&apos;s live tracking link.
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {order.status !== 'Processing' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'Processing')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface hover:bg-surface-high text-amber-800 border border-amber-200 transition-colors"
                >
                  Mark Processing
                </button>
              )}
              {order.status !== 'Shipped' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'Shipped')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary-container transition-colors flex items-center gap-1"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Mark Shipped</span>
                </button>
              )}
              {order.status !== 'Delivered' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'Delivered')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-olive text-white hover:opacity-90 transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Delivered</span>
                </button>
              )}
              {order.status !== 'Cancelled' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'Cancelled')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {/* Courier & Tracking Assignment Card */}
          <div className="bg-surface-low border border-outline-variant/40 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                <span className="font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface">
                  Courier Dispatch &amp; Tracking Code
                </span>
              </div>
              {!isEditingTracking ? (
                <button
                  type="button"
                  onClick={() => setIsEditingTracking(true)}
                  className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Tracking</span>
                </button>
              ) : null}
            </div>

            {!isEditingTracking ? (
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-on-surface-variant block text-[11px]">Carrier Partner:</span>
                  <span className="font-semibold text-on-surface">{order.carrier || carrier}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-[11px]">Tracking Identifier:</span>
                  <span className="font-mono font-bold text-primary">{order.trackingNumber || trackingNumber}</span>
                </div>
                {trackingSaved && (
                  <span className="inline-flex items-center gap-1 text-olive font-semibold text-[11px] bg-olive/10 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" />
                    <span>Saved</span>
                  </span>
                )}
              </div>
            ) : (
              <form onSubmit={handleSaveTracking} className="mt-2 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Carrier Partner
                    </label>
                    <select
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full bg-surface-lowest border border-outline-variant/60 rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="DHL Carbon-Neutral">DHL Carbon-Neutral</option>
                      <option value="FedEx Earth Ground">FedEx Earth Ground</option>
                      <option value="USPS Eco-Priority">USPS Eco-Priority</option>
                      <option value="Royal Mail Green Parcel">Royal Mail Green Parcel</option>
                      <option value="Studio Atelier Courier">Studio Atelier Courier</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Tracking Code / Parcel ID
                    </label>
                    <input
                      type="text"
                      required
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. ES-TRK-98124-US"
                      className="w-full bg-surface-lowest border border-outline-variant/60 rounded-lg px-2.5 py-1.5 text-xs font-mono text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingTracking(false)}
                    className="px-3 py-1 rounded text-xs text-on-surface-variant hover:bg-surface-high border border-outline-variant/40"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1 bg-primary hover:bg-primary-container text-white text-xs font-semibold rounded shadow-subtle flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    <span>Save Tracking</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Customer & Shipping Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-low border border-outline-variant/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-xs uppercase tracking-wider">
                <UserIcon className="w-4 h-4" />
                <span>Customer Profile</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-bold text-sm text-on-surface">
                  {order.customerName || 'Valued Patron'}
                </div>
                <div className="text-on-surface-variant flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-outline" />
                  <span>{order.customerEmail || 'guest@esondha.atelier'}</span>
                </div>
                <div className="pt-2">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] uppercase font-bold rounded ${
                      order.isGuest
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-primary/15 text-primary'
                    }`}
                  >
                    {order.isGuest ? 'Guest Checkout' : 'Registered Member'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-surface-low border border-outline-variant/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Delivery Address</span>
              </div>
              <div className="space-y-0.5 text-xs text-on-surface">
                <div className="font-semibold">{order.shippingAddress.fullName || order.customerName}</div>
                <div>{order.shippingAddress.street}</div>
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode || order.shippingAddress.zipCode}
                </div>
                <div className="text-on-surface-variant">{order.shippingAddress.country}</div>
              </div>
            </div>
          </div>

          {/* Items Purchased */}
          <div>
            <h3 className="font-headline-md text-sm font-bold text-on-surface uppercase tracking-wider mb-3">
              Items Ordered ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>
            <div className="divide-y divide-outline-variant/20 border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-lowest">
              {order.items.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg border border-outline-variant/30 bg-surface-low flex items-center justify-center p-1 shrink-0 overflow-hidden">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <ProductIllustration
                          name={item.illustration}
                          color={item.selectedColor?.hex}
                          className="w-7 h-7 stroke-[1.8]"
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-on-surface">{item.name}</div>
                      <div className="text-[11px] text-on-surface-variant flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: item.selectedColor?.hex }}
                          />
                          <span>{item.selectedColor?.name}</span>
                        </span>
                        <span>·</span>
                        <span>Size: {item.selectedSize}</span>
                        <span>·</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xs text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-[10px] text-outline">
                      ${item.price.toFixed(2)} each
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-surface-low border border-outline-variant/30 rounded-xl p-4 text-xs space-y-2">
            <div className="flex justify-between text-on-surface-variant">
              <span>Subtotal:</span>
              <span className="font-medium text-on-surface">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Carbon-Neutral Shipping:</span>
              <span className="font-medium text-on-surface">
                {order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Estimated Tax:</span>
              <span className="font-medium text-on-surface">${order.tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-outline-variant/30 pt-2 flex justify-between font-bold text-sm text-on-surface">
              <span>Total Paid:</span>
              <span className="text-primary text-base font-bold">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-outline-variant/30 bg-surface-low flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            href={`/track-order?order=${order.orderNumber}`}
            target="_blank"
            className="text-xs text-primary hover:underline font-semibold flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Tracking Link</span>
          </Link>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              type="button"
              className="w-full sm:w-auto px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-subtle"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Packing Slip</span>
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 bg-surface hover:bg-surface-high border border-outline-variant/50 text-on-surface text-xs font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Hidden-on-screen printable packing slip container */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-packing-slip, #printable-packing-slip * {
            visibility: visible !important;
          }
          #printable-packing-slip {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 32px !important;
            display: block !important;
            background: #ffffff !important;
            color: #111827 !important;
            z-index: 9999 !important;
          }
        }
      `}} />

      <div id="printable-packing-slip" className="hidden print:block font-sans text-neutral-900 p-8 bg-white max-w-3xl mx-auto">
        <div className="border-b-2 border-neutral-900 pb-4 mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight uppercase">E SONDHA Atelier</h1>
            <p className="text-xs text-neutral-600 mt-1">Slow Living &amp; Mindful Goods · esondha.atelier</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Official Packing Slip</div>
            <div className="text-sm font-bold mt-0.5 font-mono">{order.orderNumber}</div>
            <div className="text-xs text-neutral-500">Placed: {order.date}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6 text-xs border border-neutral-200 p-4 rounded-lg bg-neutral-50/50">
          <div>
            <h2 className="font-bold text-neutral-700 uppercase tracking-wider mb-1 text-[11px]">Customer Details</h2>
            <div className="font-semibold text-sm text-neutral-900">{order.customerName || 'Valued Patron'}</div>
            <div className="text-neutral-600">{order.customerEmail}</div>
            <div className="mt-1 text-[11px] text-neutral-500">{order.isGuest ? 'Guest Checkout' : 'Member Account'}</div>
          </div>
          <div>
            <h2 className="font-bold text-neutral-700 uppercase tracking-wider mb-1 text-[11px]">Shipping Destination</h2>
            <div className="font-semibold text-neutral-900">{order.shippingAddress.fullName || order.customerName}</div>
            <div className="text-neutral-700">{order.shippingAddress.street}</div>
            <div className="text-neutral-700">
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.postalCode || order.shippingAddress.zipCode}
            </div>
            <div className="text-neutral-600">{order.shippingAddress.country}</div>
          </div>
        </div>

        <div className="mb-6 p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex justify-between items-center text-xs">
          <div>
            <span className="font-bold text-neutral-700">Carrier Partner: </span>
            <span className="text-neutral-900">{order.carrier || carrier}</span>
          </div>
          <div>
            <span className="font-bold text-neutral-700">Tracking Code: </span>
            <span className="font-mono font-bold text-neutral-900">{order.trackingNumber || trackingNumber}</span>
          </div>
          <div>
            <span className="font-bold text-neutral-700">Order Status: </span>
            <span className="uppercase font-bold text-neutral-900">{order.status}</span>
          </div>
        </div>

        <div className="mb-6">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-300 bg-neutral-100">
                <th className="py-2.5 px-3 font-bold text-neutral-800">Item Description</th>
                <th className="py-2.5 px-3 font-bold text-neutral-800 text-center">Selected Color</th>
                <th className="py-2.5 px-3 font-bold text-neutral-800 text-center">Size</th>
                <th className="py-2.5 px-3 font-bold text-neutral-800 text-center">Qty</th>
                <th className="py-2.5 px-3 font-bold text-neutral-800 text-right">Unit Price</th>
                <th className="py-2.5 px-3 font-bold text-neutral-800 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {order.items.map((item, idx) => (
                <tr key={`print-${item.id}-${idx}`}>
                  <td className="py-2.5 px-3 font-medium text-neutral-900">{item.name}</td>
                  <td className="py-2.5 px-3 text-center text-neutral-700">{item.selectedColor?.name || 'Standard'}</td>
                  <td className="py-2.5 px-3 text-center text-neutral-700">{item.selectedSize || 'Standard'}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-neutral-900">{item.quantity}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-neutral-700">${item.price.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-900">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-64 text-xs space-y-1.5 border border-neutral-200 p-3 rounded-lg bg-neutral-50">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal:</span>
              <span className="font-mono text-neutral-900">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Carbon-Neutral Shipping:</span>
              <span className="font-mono text-neutral-900">{order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Estimated Tax:</span>
              <span className="font-mono text-neutral-900">${order.tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-neutral-300 pt-1.5 flex justify-between font-bold text-sm text-neutral-900">
              <span>Total Paid:</span>
              <span className="font-mono">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-4 text-center text-[10px] text-neutral-500">
          <p>Thank you for supporting sustainable, mindful slow-living design. For support or returns, visit esondha.atelier or contact care@esondha.atelier.</p>
        </div>
      </div>
    </div>
  );
};
