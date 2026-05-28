/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Button, message, Modal } from 'antd';
import { motion } from 'framer-motion';

const PLANS = [
  {
    id: 'free',
    name: 'Miễn phí',
    price: '0đ',
    period: '/mãi mãi',
    storage: '50 MB',
    badge: null,
    features: [
      'Lưu trữ tối đa 50 MB',
      'Trợ lý AI cơ bản',
      'Tham gia 3 nhóm học tập',
      'Tải lên 10 tài liệu/ngày',
    ],
    disabledFeatures: [
      'Phân tích AI nâng cao',
      'Không giới hạn nhóm',
      'Hỗ trợ ưu tiên 24/7',
    ],
    cta: 'Gói hiện tại',
    disabled: true,
    gradient: 'from-gray-50 to-white',
    borderColor: 'border-black/[0.06]',
    iconBg: 'bg-black/[0.03]',
    iconColor: 'text-black/40',
  },
  {
    id: 'pro',
    name: 'Pro Student',
    price: '99.000đ',
    period: '/tháng',
    storage: '500 MB',
    badge: 'Phổ biến nhất',
    features: [
      'Lưu trữ tối đa 500 MB',
      'Trợ lý AI không giới hạn',
      'Tham gia không giới hạn nhóm',
      'Tải lên không giới hạn',
      'Phân tích AI nâng cao',
      'Xuất PDF tóm tắt',
    ],
    disabledFeatures: [
      'Hỗ trợ ưu tiên 24/7',
    ],
    cta: 'Nâng cấp ngay',
    disabled: false,
    gradient: 'from-[#fff7f0] to-white',
    borderColor: 'border-[#ff5c00]/20',
    iconBg: 'bg-gradient-to-br from-[#ff8a00] to-[#ff5c00]',
    iconColor: 'text-white',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '249.000đ',
    period: '/tháng',
    storage: '5 GB',
    badge: 'Tối đa',
    features: [
      'Lưu trữ tối đa 5 GB',
      'Trợ lý AI không giới hạn',
      'Tham gia không giới hạn nhóm',
      'Tải lên không giới hạn',
      'Phân tích AI nâng cao',
      'Xuất PDF tóm tắt',
      'Hỗ trợ ưu tiên 24/7',
    ],
    disabledFeatures: [],
    cta: 'Liên hệ tư vấn',
    disabled: false,
    gradient: 'from-[#f0f0ff] to-white',
    borderColor: 'border-[#a855f7]/20',
    iconBg: 'bg-gradient-to-br from-[#a855f7] to-[#7c3aed]',
    iconColor: 'text-white',
  },
];

const PAYMENT_METHODS = [
  { id: 'visa', label: 'Visa', icon: 'bi-credit-card-2-front' },
  { id: 'momo', label: 'MoMo', icon: 'bi-phone' },
  { id: 'vnpay', label: 'VNPay', icon: 'bi-bank' },
  { id: 'zalopay', label: 'ZaloPay', icon: 'bi-wallet2' },
];

export default function PaymentScreen({ accentColor = '#ff5c00', onNavigate }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('visa');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelectPlan = (plan) => {
    if (plan.disabled) return;
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const handleConfirmPayment = () => {
    setShowCheckout(false);
    setTimeout(() => {
      setShowSuccess(true);
    }, 300);
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-3 sm:px-4 md:px-8 pb-10 pt-4 text-left select-none relative">
      <div>
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-[#1d1d1f] tracking-tight">Nâng cấp dung lượng</h2>
          <p className="text-[12px] sm:text-[13px] text-black/45 mt-1 font-semibold max-w-lg leading-relaxed">
            Chọn gói lưu trữ phù hợp để mở rộng kho tài liệu học tập và trải nghiệm trợ lý AI không giới hạn
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`bg-gradient-to-b ${plan.gradient} rounded-2xl sm:rounded-3xl border ${plan.borderColor} p-5 sm:p-6 flex flex-col relative overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                plan.id === 'pro' ? 'ring-2 ring-[#ff5c00]/20' : ''
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <span className={`absolute top-4 right-4 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  plan.id === 'pro' 
                    ? 'bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white shadow-md shadow-[#ff5c00]/20' 
                    : 'bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/20'
                }`}>
                  {plan.badge}
                </span>
              )}

              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl ${plan.iconBg} flex items-center justify-center ${plan.iconColor} mb-4 shadow-sm`}>
                <i className={`bi ${plan.id === 'free' ? 'bi-cloud' : plan.id === 'pro' ? 'bi-lightning-charge-fill' : 'bi-rocket-takeoff-fill'} text-[18px]`} />
              </div>

              {/* Plan Name */}
              <h3 className="text-[15px] font-black text-[#1d1d1f] tracking-tight">{plan.name}</h3>

              {/* Price */}
              <div className="flex items-baseline gap-1 mt-2 mb-1">
                <span className="text-[28px] sm:text-[32px] font-black text-[#1d1d1f] tracking-tight">{plan.price}</span>
                <span className="text-[12px] font-bold text-black/35">{plan.period}</span>
              </div>

              {/* Storage */}
              <div className="flex items-center gap-1.5 mb-5">
                <i className="bi bi-hdd text-[12px] text-black/40" />
                <span className="text-[12px] font-bold text-black/55">{plan.storage} dung lượng</span>
              </div>

              {/* Features */}
              <div className="flex-1 space-y-2.5 mb-6">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <i className="bi bi-check-circle-fill text-[12px] text-green-500 mt-0.5 shrink-0" />
                    <span className="text-[12px] font-semibold text-black/65 leading-snug">{f}</span>
                  </div>
                ))}
                {plan.disabledFeatures.map((f, i) => (
                  <div key={`d-${i}`} className="flex items-start gap-2.5">
                    <i className="bi bi-x-circle text-[12px] text-black/20 mt-0.5 shrink-0" />
                    <span className="text-[12px] font-semibold text-black/30 leading-snug line-through">{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={plan.disabled}
                className={`w-full py-2.5 sm:py-3 rounded-xl font-bold text-[13px] transition-all cursor-pointer disabled:cursor-not-allowed ${
                  plan.id === 'pro'
                    ? 'bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white shadow-lg shadow-[#ff5c00]/20 hover:opacity-90 active:scale-[0.98]'
                    : plan.disabled
                    ? 'bg-black/[0.03] text-black/30 border border-black/5'
                    : 'bg-black/[0.02] text-black/70 border border-black/8 hover:border-black/20 hover:text-black active:scale-[0.98]'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Comparison section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.04] p-4 sm:p-6 shadow-sm">
          <h3 className="text-[14px] font-black text-[#1d1d1f] mb-4 tracking-tight">So sánh chi tiết các gói</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-[12px]">
              <thead>
                <tr className="border-b border-black/5">
                  <th className="text-left py-3 font-black text-black/40 uppercase tracking-wider text-[10px]">Tính năng</th>
                  <th className="text-center py-3 font-black text-black/40 uppercase tracking-wider text-[10px]">Miễn phí</th>
                  <th className="text-center py-3 font-black text-[#ff5c00] uppercase tracking-wider text-[10px]">Pro Student</th>
                  <th className="text-center py-3 font-black text-[#a855f7] uppercase tracking-wider text-[10px]">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Dung lượng lưu trữ', '50 MB', '500 MB', '5 GB'],
                  ['Tải lên/ngày', '10 file', 'Không giới hạn', 'Không giới hạn'],
                  ['Nhóm học tập', '3 nhóm', 'Không giới hạn', 'Không giới hạn'],
                  ['Trợ lý AI', 'Cơ bản', 'Nâng cao', 'Nâng cao'],
                  ['Xuất PDF', '—', '✓', '✓'],
                  ['Hỗ trợ 24/7', '—', '—', '✓'],
                ].map(([feature, ...vals], i) => (
                  <tr key={i} className="border-b border-black/[0.03]">
                    <td className="py-3 font-semibold text-black/60">{feature}</td>
                    {vals.map((v, j) => (
                      <td key={j} className={`py-3 text-center font-bold ${v === '—' ? 'text-black/20' : v === '✓' ? 'text-green-500' : 'text-black/70'}`}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal
        title={null}
        open={showCheckout}
        onCancel={() => setShowCheckout(false)}
        footer={null}
        width={480}
        destroyOnHidden
        centered
      >
        {selectedPlan && (
          <>
            <div className="bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] px-6 py-5 flex items-center gap-4 relative overflow-hidden rounded-t-2xl">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white backdrop-blur-md shadow-xl z-10">
                <i className="bi bi-credit-card-2-front-fill text-[20px]" />
              </div>
              <div className="text-left text-white z-10">
                <h3 className="text-[16px] font-extrabold tracking-tight">Thanh toán gói {selectedPlan.name}</h3>
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider mt-0.5">{selectedPlan.price}{selectedPlan.period}</p>
              </div>
            </div>

            <div className="p-6 bg-[#fcfcfd] rounded-b-2xl space-y-5">
              {/* Payment Methods */}
              <div>
                <span className="text-[10px] font-black text-black/35 uppercase tracking-widest block mb-3">Phương thức thanh toán</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedMethod === m.id
                          ? 'border-[#ff5c00]/30 bg-[#ff5c00]/5 text-[#ff5c00]'
                          : 'border-black/5 bg-white text-black/50 hover:border-black/15'
                      }`}
                    >
                      <i className={`bi ${m.icon} text-[18px] block mb-1`} />
                      <span className="text-[10px] font-bold block">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Form (mock) */}
              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-black/35 uppercase tracking-widest block">Tên chủ thẻ</label>
                  <input
                    type="text"
                    placeholder="NGUYEN VAN A"
                    className="w-full bg-white border border-black/8 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-black outline-none focus:border-[#ff5c00]/40 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-black/35 uppercase tracking-widest block">Số thẻ</label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    className="w-full bg-white border border-black/8 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-black outline-none focus:border-[#ff5c00]/40 transition-all font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-black/35 uppercase tracking-widest block">Ngày hết hạn</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full bg-white border border-black/8 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-black outline-none focus:border-[#ff5c00]/40 transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-black/35 uppercase tracking-widest block">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength={3}
                      className="w-full bg-white border border-black/8 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-black outline-none focus:border-[#ff5c00]/40 transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-black/[0.01] border border-black/5 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-[12px]">
                  <span className="font-semibold text-black/50">Gói đăng ký</span>
                  <span className="font-bold text-black">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="font-semibold text-black/50">Dung lượng</span>
                  <span className="font-bold text-black">{selectedPlan.storage}</span>
                </div>
                <div className="flex justify-between text-[12px] pt-2 border-t border-black/5">
                  <span className="font-black text-black">Tổng thanh toán</span>
                  <span className="font-black text-[#ff5c00] text-[14px]">{selectedPlan.price}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button onClick={() => setShowCheckout(false)} className="rounded-xl font-bold text-[12px] h-9 border-black/10">
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  onClick={handleConfirmPayment}
                  className="rounded-xl font-extrabold text-[12px] h-9 px-6 shadow-md shadow-[#ff5c00]/20"
                >
                  <i className="bi bi-shield-lock mr-1.5" />
                  Xác nhận thanh toán
                </Button>
              </div>
            </div>
          </>
        )}
      </Modal>

      {/* Success Modal */}
      <Modal
        title={null}
        open={showSuccess}
        onCancel={() => setShowSuccess(false)}
        footer={null}
        width={400}
        centered
        destroyOnHidden
      >
        <div className="p-8 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-5 border border-green-500/20"
          >
            <i className="bi bi-check-lg text-green-500 text-[30px]" />
          </motion.div>
          <h3 className="text-[18px] font-black text-[#1d1d1f] mb-2">Thanh toán thành công!</h3>
          <p className="text-[13px] text-black/50 font-semibold mb-6 leading-relaxed">
            Gói <strong className="text-[#ff5c00]">{selectedPlan?.name}</strong> đã được kích hoạt.
            Dung lượng lưu trữ của bạn đã được nâng cấp lên <strong>{selectedPlan?.storage}</strong>.
          </p>
          <Button
            type="primary"
            onClick={() => {
              setShowSuccess(false);
              message.success('Chào mừng bạn đến với gói mới!');
            }}
            className="rounded-xl font-bold text-[13px] h-10 px-8"
          >
            Tuyệt vời, bắt đầu sử dụng!
          </Button>
        </div>
      </Modal>
    </div>
  );
}
