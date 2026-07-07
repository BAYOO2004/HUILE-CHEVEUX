/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ShoppingBag, 
  Phone, 
  MapPin, 
  Truck, 
  Heart, 
  Star, 
  ShieldCheck, 
  AlertCircle, 
  User, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  ChevronDown,
  Info, 
  X, 
  MessageSquare, 
  MessageCircle,
  Database, 
  Copy, 
  Check,
  Plus, 
  Minus,
  TrendingUp,
  Activity,
  Award,
  Users,
  ArrowLeftRight,
  RotateCw,
  Zap,
  CheckCircle,
  HelpCircle,
  ShoppingBag as BagIcon,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { initMetaPixel, trackMetaEvent } from './lib/metaPixel';

const bottleImg = "https://pluhjzrozhfkyzbuwqij.supabase.co/storage/v1/object/public/IMAGES/HUILE%20IMAGES/gen-019f2717-1866-7f50-914c-71f793be62c3-0.png";
import lifestyleImg from './assets/images/hair_lifestyle_1783326007965.jpg';

// Premium high-converting Cures configuration
const CURES = [
  {
    id: 'cure_1',
    name: 'Flacon Individuel',
    bottlesCount: 1,
    volume: '100ml (1 flacon)',
    price: 10000,
    originalPrice: 15000,
    discountLabel: 'Livraison Gratuite',
    tag: 'Découvrir l\'efficacité',
    tagColor: 'bg-stone-100 text-stone-700 border-stone-200',
    description: 'Un flacon de notre huile d\'excellence pour initier votre routine capillaire. Nourrit le cuir chevelu en profondeur et stimule les repousses.',
    popular: false,
    badgeText: 'Essai'
  },
  {
    id: 'cure_2',
    name: 'Pack Duo Économique',
    bottlesCount: 2,
    volume: '2 flacons de 100ml',
    price: 17000,
    originalPrice: 30000,
    discountLabel: 'Économisez 3 000 FCFA + Livraison Gratuite',
    tag: 'Application régulière sans pause',
    tagColor: 'bg-pink-50 text-[#391CB7] border-pink-200/50',
    description: 'Deux flacons identiques pour prolonger l\'application. Éviter toute rupture de stock vous garantit des résultats plus rapides et plus visibles.',
    popular: false,
    badgeText: 'Forte Vente'
  },
  {
    id: 'cure_3',
    name: 'Pack Trio Recommandé',
    bottlesCount: 3,
    volume: '3 flacons de 100ml',
    price: 22000,
    originalPrice: 45000,
    discountLabel: 'Économisez 8 000 FCFA + Livraison Gratuite',
    tag: 'Traitement continu & Résultats maximaux',
    tagColor: 'bg-pink-100 text-pink-700 border-pink-300/60',
    description: 'Trois flacons identiques de 100ml pour une utilisation continue. C\'est le choix idéal pour nourrir durablement les bulbes capillaires et maximiser la repousse.',
    popular: true,
    badgeText: 'Meilleure Valeur (97% de satisfaction)'
  }
];

// Benin Cities config with regional distribution shipping costs
const BENIN_CITIES = [
  'Cotonou',
  'Abomey-Calavi',
  'Porto-Novo',
  'Parakou',
  'Ouidah',
  'Bohicon',
  'Abomey',
  'Natitingou',
  'Kandi',
  'Djougou',
  'Lokossa',
  'Savalou',
  'Allada'
];

const BENIN_WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '2290192570665'; // Benin Order Hotline

// Shipping calculation helper
const getShippingPrice = (city: string, bottlesCount: number, price: number = 10000) => {
  if (price >= 10000) return 0;
  if (bottlesCount >= 3) return 0;
  const isLocal = ['Cotonou', 'Abomey-Calavi', 'Porto-Novo'].includes(city);
  if (isLocal) {
    return bottlesCount === 1 ? 1500 : 1000;
  } else {
    return bottlesCount === 1 ? 2500 : 2000;
  }
};

const getDeliveryEst = (city: string) => {
  if (['Cotonou', 'Abomey-Calavi'].includes(city)) return 'Livraison Express sous 24 heures a domicile';
  if (city === 'Porto-Novo') return 'Livraison Express sous 24 a 48 heures';
  if (['Parakou', 'Natitingou', 'Kandi', 'Djougou'].includes(city)) return 'Livraison securisee sous 48 a 72 heures';
  return 'Livraison securisee sous 24 a 48 heures';
};

// Social proof marquee reviews
const REVIEWS = [
  { 
    name: "Amina Soglo", 
    city: "Cotonou", 
    text: "J'avais les tempes completement degarnies a cause des tresses trop serrees. Apres 3 semaines de massage quotidien avec l'huile Golden Circle, j'ai vu apparaitre de nouvelles repousses denses. Mes cheveux ne cassent plus !", 
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=120&h=120"
  },
  { 
    name: "Koffi Houngbo", 
    city: "Porto-Novo", 
    text: "Une odeur naturelle agreable et une legerete surprenante. Ca ne graisse pas lourdement le cheveu. Ma femme l'utilise aussi, sa croissance a ete incroyable ces deux derniers mois.", 
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=120&h=120"
  },
  { 
    name: "Mariama Gado", 
    city: "Parakou", 
    text: "Resultats visibles sur la chute des la deuxieme semaine. Mes cheveux crepus sont beaucoup plus doux, hydrates et faciles a coiffer. Je recommande vivement l'option de 3 flacons pour un traitement sans pause.", 
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=120&h=120"
  },
  { 
    name: "Sika Lawson", 
    city: "Ouidah", 
    text: "Je l'applique tous les soirs sur mon cuir chevelu. Mes cheveux qui stagnaient depuis un an ont enfin pris de la longueur et du volume. Produit d'une qualite rare au Benin.", 
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=120&h=120"
  },
  { 
    name: "Abdoulaye Bio", 
    city: "Djougou", 
    text: "Le service client est exceptionnel et la livraison a Djougou s'est faite tres rapidement. Le paiement a la livraison m'a beaucoup rassure. L'huile est d'une efficacite redoutable.", 
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=120&h=120"
  },
  { 
    name: "Grace Gbaguidi", 
    city: "Abomey-Calavi", 
    text: "Je souffrais d'alopecie de traction severe. Apres un mois d'utilisation, les trous se referment avec de vrais cheveux vigoureux. Merci Golden Circle !", 
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1523825036634-a6225091a95a?auto=format&fit=crop&q=80&w=120&h=120"
  }
];

// Real customer avant-après (before/after) results
const REAL_CASES = [
  {
    id: 1,
    title: "Cas n°1 : Alopécie & Recul Capillaire (Homme)",
    description: "Traitement intensif d'une calvitie naissante et perte de densité sur le cuir chevelu d'un client au Bénin. Résultats visibles dès 4 semaines de traitement quotidien.",
    before: "https://pluhjzrozhfkyzbuwqij.supabase.co/storage/v1/object/public/IMAGES/HUILE%20IMAGES/AVANT%20HOMME%20.png",
    after: "https://pluhjzrozhfkyzbuwqij.supabase.co/storage/v1/object/public/IMAGES/HUILE%20IMAGES/APRES%20HOMME%20.png",
    labelBefore: "Avant : Dégarni & Clairsemé",
    labelAfter: "Après : Repousse dense & saine"
  },
  {
    id: 2,
    title: "Cas n°2 : Alopécie de Traction (Femme)",
    description: "Traitement d'une perte sévère de cheveux suite à des tresses trop serrées et une alopécie de traction. Repousse complète constatée après une application régulière de 3 flacons.",
    before: "https://pluhjzrozhfkyzbuwqij.supabase.co/storage/v1/object/public/IMAGES/HUILE%20IMAGES/AVANT%20FEMME%20.jpg",
    after: "https://pluhjzrozhfkyzbuwqij.supabase.co/storage/v1/object/public/IMAGES/HUILE%20IMAGES/APRES%20FEMME%20.jpg",
    labelBefore: "Avant : Tempes dégarnies",
    labelAfter: "Après : Volume & longueur"
  }
];

export default function App() {
  // State management
  const [selectedCure, setSelectedCure] = useState(CURES[2]); // Default to Cure Complete (3 flacons)
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: BENIN_CITIES[0],
    customCity: '',
    address: '',
    notes: ''
  });
  
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  
  // Custom diagnostic state
  const [diagnosticStep, setDiagnosticStep] = useState(1);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState({
    hairType: '',
    scalpState: '',
    mainConcern: '',
    routineComplexity: 'intermediaire'
  });
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [isDiagnosticLoading, setIsDiagnosticLoading] = useState(false);
  const [diagnosticApplied, setDiagnosticApplied] = useState(false);

  // Before/After interactive slider state
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Interactive Live Purchases/Notifications ticker (Social Proof)
  const [recentPurchase, setRecentPurchase] = useState<any>(null);
  const purchaseNames = ['Amina D.', 'Saliou M.', 'Rachida T.', 'Gilles K.', 'Marielle S.', 'Femi O.', 'Cossi B.', 'Chantal N.'];
  const purchaseCities = ['Cotonou', 'Abomey-Calavi', 'Porto-Novo', 'Parakou', 'Ouidah', 'Bohicon', 'Allada', 'Savalou'];
  const purchaseCures = [CURES[2], CURES[1], CURES[2], CURES[2], CURES[0]];

  // FAQ Active State
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Toast Notification System
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Seller/Admin Dashboard Overlay & Authentication State
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(!!sessionStorage.getItem('admin_pwd'));
  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminStats, setAdminStats] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Handle Before/After dragging
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  // Initialize Meta Pixel on mount
  useEffect(() => {
    initMetaPixel();
  }, []);

  // Countdown timer for announcement banner (promotional urgency)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // Next midnight
      const diff = midnight.getTime() - now.getTime();
      
      let hours = Math.floor(diff / (1000 * 60 * 60));
      let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      if (hours < 0) hours = 0;
      if (minutes < 0) minutes = 0;
      if (seconds < 0) seconds = 0;
      
      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Phone number real-time validation handler
  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/\s/g, '');
    setFormData(prev => ({ ...prev, phone: cleaned }));
    
    const digitsOnly = cleaned.replace(/\D/g, '');
    if (cleaned.length > 0 && cleaned !== digitsOnly) {
      setPhoneError("Le numéro ne doit contenir que des chiffres.");
    } else if (cleaned.length > 0 && cleaned.length !== 8 && cleaned.length !== 10) {
      setPhoneError("Le numéro au Bénin doit comporter exactement 8 ou 10 chiffres (Ex: 0196XXXXXX ou 90XXXXXX).");
    } else if (cleaned.length === 10 && !cleaned.startsWith('01')) {
      setPhoneError("Un numéro béninois à 10 chiffres doit commencer par '01'.");
    } else {
      setPhoneError(null);
    }
  };

  // Generate Live Ticker Purchases
  useEffect(() => {
    const interval = setInterval(() => {
      const name = purchaseNames[Math.floor(Math.random() * purchaseNames.length)];
      const city = purchaseCities[Math.floor(Math.random() * purchaseCities.length)];
      const cure = purchaseCures[Math.floor(Math.random() * purchaseCures.length)];
      const minutes = Math.floor(Math.random() * 8) + 1;

      setRecentPurchase({ name, city, cure, minutes });

      // Auto-hide ticker after 6 seconds
      setTimeout(() => {
        setRecentPurchase(null);
      }, 6000);
    }, 18000);

    return () => clearInterval(interval);
  }, []);

  // Fetch orders for admin panel (Secured)
  const fetchOrders = async (pwd?: string) => {
    const activePwd = pwd || sessionStorage.getItem('admin_pwd') || '';
    if (!activePwd) {
      setAdminAuthError("Veuillez vous authentifier pour accéder au tableau de bord.");
      setShowAdminAuth(true);
      return;
    }

    setAdminLoading(true);
    setAdminAuthError('');
    try {
      const res = await fetch('/api/orders', {
        headers: { 
          'x-admin-password': activePwd,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (res.status === 401 || !data.success) {
        setAdminAuthError(data.error || "Mot de passe de gestion incorrect.");
        setIsAdminAuthenticated(false);
        sessionStorage.removeItem('admin_pwd');
        setShowAdminAuth(true);
      } else {
        setAdminOrders(data.orders);
        setIsAdminAuthenticated(true);
        if (pwd) {
          sessionStorage.setItem('admin_pwd', pwd);
        }
        const revenue = data.orders.reduce((acc: number, curr: any) => acc + (curr.total_price || 0), 0);
        setAdminStats({
          totalOrders: data.orders.length,
          totalRevenue: revenue
        });
        setShowAdmin(true);
        setShowAdminAuth(false);
      }
    } catch (e) {
      console.error("Error fetching orders:", e);
      setAdminAuthError("Impossible de contacter le serveur d'administration.");
    } finally {
      setAdminLoading(false);
    }
  };

  // Update order status (Secured)
  const updateOrderStatus = async (id: string, currentStatus: string) => {
    const nextStatusMap: { [key: string]: string } = {
      'Nouveau': 'En cours',
      'En cours': 'Livre',
      'Livre': 'Annule',
      'Annule': 'Nouveau'
    };
    const nextStatus = nextStatusMap[currentStatus] || 'Nouveau';
    const pwd = sessionStorage.getItem('admin_pwd') || '';

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': pwd
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
        showToast("Statut de la commande mis à jour avec succès", "success");
      }
    } catch (e) {
      console.error("Error updating order:", e);
      showToast("Erreur lors de la mise à jour du statut", "error");
    }
  };

  // AI Diagnostic handler
  const runDiagnostic = async () => {
    if (!diagnosticAnswers.hairType || !diagnosticAnswers.scalpState || !diagnosticAnswers.mainConcern) {
      showToast("Veuillez sélectionner toutes les options avant de lancer le diagnostic.", "error");
      return;
    }

    setIsDiagnosticLoading(true);
    try {
      const response = await fetch('/api/gemini/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diagnosticAnswers)
      });
      const data = await response.json();
      if (data.success) {
        setDiagnosticResult(data.diagnostic);
        setDiagnosticStep(4);
        showToast("Diagnostic capillaire IA généré avec succès !", "success");
      } else {
        throw new Error(data.error || "Génération échouée");
      }
    } catch (e) {
      console.warn("Diagnostic API error, using high-quality local fallback:", e);
      // Fallback response for offline / limit cases
      const fallbackResult = {
        diagnosticSummary: `Votre type de cheveux ${diagnosticAnswers.hairType} associé à un cuir chevelu ${diagnosticAnswers.scalpState} requiert une nutrition d'une pureté absolue pour contrer votre problème de ${diagnosticAnswers.mainConcern}. L'huile Golden Circle va gainer chaque fibre sans alourdir.`,
        recommendations: [
          `Massez doucement votre cuir chevelu pendant 5 minutes après chaque application de Golden Circle pour maximiser l'absorption.`,
          `Évitez les shampooings décapants contenant des sulfates agressifs qui irritent votre épiderme.`,
          `Privilégiez un séchage doux à l'air libre après votre soin Golden Circle.`
        ],
        routine: {
          frequency: "3 applications par semaine",
          morning: "Humidifiez légèrement pour ouvrir les cuticules, appliquez 3 gouttes de Golden Circle sur les longueurs.",
          evening: "Appliquez 8 à 10 gouttes directement sur les racines, massez en mouvements circulaires pendant 4 minutes, laissez agir toute la nuit.",
          massageTips: "Utilisez la pulpe des doigts en partant de la nuque vers le sommet du crâne pour stimuler la microcirculation."
        },
        timeline: {
          week2: "Sensation de confort retrouvée, réduction des pellicules et du cuir chevelu sec.",
          month1: "Cheveux visiblement plus forts à la racine, diminution drastique de la casse lors du brossage.",
          month3: "Apparition de nouvelles repousses denses, longueur accrue de 3 à 5 cm."
        },
        keyIngredientsTip: "Notre formule de Golden Circle enrichie en acides gras naturels est spécialement calibrée pour purifier et nourrir votre profil capillaire unique."
      };
      setDiagnosticResult(fallbackResult);
      setDiagnosticStep(4);
      showToast("Diagnostic IA personnalisé prêt !", "success");
    } finally {
      setIsDiagnosticLoading(false);
    }
  };

  const applyDiagnosticOffer = () => {
    setDiagnosticApplied(true);
    setSelectedCure(CURES[2]); // Dynamic auto-select 3 bottles (recommended)
    showToast("Diagnostic complété ! La Cure Complète recommandée a été sélectionnée.", "success");
    document.getElementById('cures-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Submit order handler (Saves order locally and opens WhatsApp)
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast("Veuillez remplir votre nom et votre numéro de téléphone.", "error");
      return;
    }

    const cleanPhone = formData.phone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 8 && cleanPhone.length !== 10) {
      setPhoneError("Le numéro au Bénin doit comporter exactement 8 ou 10 chiffres (Ex: 0196XXXXXX ou 90XXXXXX).");
      showToast("Le numéro de téléphone Bénin doit comporter exactement 8 ou 10 chiffres.", "error");
      return;
    }

    if (cleanPhone.length === 10 && !cleanPhone.startsWith('01')) {
      setPhoneError("Un numéro béninois à 10 chiffres doit commencer par '01'.");
      showToast("Un numéro béninois à 10 chiffres doit commencer par '01'.", "error");
      return;
    }

    setPhoneError(null);

    if (!formData.address.trim()) {
      setAddressError("Veuillez préciser votre quartier ou adresse précise pour la livraison.");
      showToast("Veuillez renseigner votre quartier ou adresse précise.", "error");
      return;
    }
    setAddressError(null);

    const cityToSubmit = formData.city === 'Autre' ? formData.customCity : formData.city;
    if (!cityToSubmit) {
      showToast("Veuillez préciser votre ville.", "error");
      return;
    }

    const finalPrice = selectedCure.price;
    const shipping = getShippingPrice(cityToSubmit, selectedCure.bottlesCount, finalPrice);
    const totalToPay = finalPrice + shipping;

    // Track Meta Pixel InitiateCheckout Event
    trackMetaEvent('InitiateCheckout', {
      value: totalToPay,
      currency: 'XOF',
      content_name: selectedCure.name,
      content_ids: [selectedCure.id],
      content_type: 'product',
      num_items: selectedCure.bottlesCount
    });

    const orderPayload = {
      customer_name: formData.name,
      customer_phone: `+229 ${formData.phone}`,
      city: cityToSubmit,
      address: formData.address,
      bundle_id: selectedCure.id,
      bundle_name: `${selectedCure.name} (${selectedCure.volume})`,
      quantity: selectedCure.bottlesCount,
      total_price: totalToPay,
      notes: formData.notes
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await response.json();
      console.log("Order saved:", data);

      showToast("Commande enregistrée avec succès ! Redirection vers WhatsApp...", "success");

      const codBannerText = "*PAIEMENT A LA LIVRAISON (COD)*";
      const whatsappMessage = `Bonjour Golden Circle !

Je souhaite commander le pack de cure suivant :
- Cure : *${selectedCure.name}* - ${selectedCure.volume}
- Tarif : ${finalPrice.toLocaleString('fr-FR')} FCFA
- Livraison : ${shipping === 0 ? "Gratuite" : `${shipping.toLocaleString('fr-FR')} FCFA`}
- *TOTAL A PAYER : ${totalToPay.toLocaleString('fr-FR')} FCFA*

*MES INFORMATIONS DE LIVRAISON :*
- Nom complet : ${formData.name}
- Numero de telephone : +229 ${formData.phone}
- Ville : ${cityToSubmit}
- Quartier / Adresse : ${formData.address || 'A preciser lors de l\'appel'}
${formData.notes ? `- Note / Instruction : ${formData.notes}` : ''}
${diagnosticApplied ? `_Beneficiaire de l'offre Diagnostic IA_` : ''}

${codBannerText}
Merci de confirmer ma commande et de planifier l'expedition !`;

      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/${BENIN_WHATSAPP}?text=${encodedMessage}`;
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);

    } catch (e) {
      console.error("Order save failure:", e);
      showToast("Commande enregistrée localement (redirection secours WhatsApp...)", "info");
      const fallbackMsg = `Bonjour ! Je souhaite commander ${selectedCure.name} pour ${selectedCure.price + shipping} FCFA. Nom: ${formData.name}, Tel: +229 ${formData.phone}, Ville: ${cityToSubmit}`;
      setTimeout(() => {
        window.open(`https://wa.me/${BENIN_WHATSAPP}?text=${encodeURIComponent(fallbackMsg)}`, '_blank');
      }, 1000);
    }
  };

  const activeShippingFee = getShippingPrice(
    formData.city === 'Autre' ? formData.customCity : formData.city, 
    selectedCure.bottlesCount,
    selectedCure.price
  );
  
  const finalTotalAmount = selectedCure.price + activeShippingFee;

  // Premium Logo styled for Golden Circle brand
  const GoldenCircleLogo = ({ className = "text-xl" }: { className?: string }) => (
    <span className={`font-serif font-black tracking-widest text-white uppercase ${className}`}>
      GOLDEN <span className="font-sans text-stone-100 font-light text-sm">CIRCLE</span>
    </span>
  );

  return (
    <div id="landing-page-container" className="min-h-screen bg-[#FFFDFE] text-stone-900 font-sans relative overflow-x-hidden">
      
      {/* Background visual beams - dynamic brand colors */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-pink-300/10 to-pink-200/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-10 w-[500px] h-[500px] bg-gradient-to-br from-pink-400/5 to-pink-300/5 blur-[100px] pointer-events-none -z-10" />

      {/* 1. Dynamic Vibrant Header Banner - Sleek Dark Charcoal with Real-time Countdown */}
      <div id="announcement-banner" className="bg-stone-950 text-white py-2.5 px-4 text-center text-xs font-semibold tracking-wider flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 shadow-inner">
        <div className="flex items-center gap-2 justify-center">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
          <span className="uppercase tracking-widest text-[10px] sm:text-[11px] md:text-xs">LIVRAISON GRATUITE SUR TOUT LE BENIN DÈS 10 000 FCFA</span>
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
        </div>
        <div className="flex items-center gap-1.5 bg-pink-950/40 border border-pink-500/20 px-3 py-1 rounded-full text-[10px] sm:text-[11px] text-pink-400 font-bold">
          <Clock className="w-3.5 h-3.5" />
          <span>La promo se termine dans :</span>
          <span className="font-mono text-white bg-stone-900 px-1.5 py-0.5 rounded border border-white/5">
            {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
          </span>
        </div>
      </div>

      {/* 2. Premium Luxury Navigation Header - Vibrant Royal Indigo from mockup */}
      <header id="main-header" className="sticky top-0 bg-[#391CB7] text-white z-40 shadow-md transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GoldenCircleLogo />
          </div>
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-white/90">
            <a href="#concept" className="hover:text-pink-100 transition">Le Produit</a>
            <a href="#ingredients" className="hover:text-pink-100 transition">Ingredients</a>
            <a href="#diagnostic" className="hover:text-pink-100 transition flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-white fill-white" /> Diagnostic IA
            </a>
            <a href="#results" className="hover:text-pink-100 transition">Resultats</a>
            <a href="#cures" className="hover:text-pink-100 transition">Tarifs</a>
          </nav>
          <div className="flex items-center gap-3">
            <a 
              href="#cures" 
              className="px-5 py-2.5 bg-stone-900 text-white hover:bg-stone-800 transition rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-pink-400" /> Commander
            </a>
          </div>
        </div>
      </header>

      {/* 3. High-End Vibrant Hero Section */}
      <section id="hero-section" className="relative py-16 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-500/10 border border-pink-500/20 rounded-full text-xs font-bold text-pink-600 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> Bestseller au Benin
            </div>

            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-extrabold text-stone-950 leading-[1.08] tracking-tight">
              Retrouvez des cheveux d'une <span className="italic text-pink-600 underline decoration-pink-500/30">force</span> et d'une <span className="text-pink-600">longueur</span> exceptionnelles.
            </h1>

            <p className="text-stone-600 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
              L'huile capillaire précieuse d'exception <strong className="text-stone-950 font-bold">Golden Circle</strong> stimule directement l'activité des follicules pileux, densifie les tempes et répare les fibres en profondeur. Retrouvez des racines vigoureuses et dites adieu à la casse.
            </p>

            {/* Crucial Bullet Points in Black Check Grid (Matches mockup AFTER image) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white p-5 rounded-2xl shadow-sm border border-pink-100 hover:border-pink-300 transition duration-300">
                <span className="w-6 h-6 rounded-full bg-stone-950 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h4 className="font-extrabold text-sm text-stone-900">Active la Croissance</h4>
                  <p className="text-stone-500 text-xs mt-1">Réveille efficacement les follicules pileux inactifs.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-5 rounded-2xl shadow-sm border border-pink-100 hover:border-pink-300 transition duration-300">
                <span className="w-6 h-6 rounded-full bg-stone-950 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h4 className="font-extrabold text-sm text-stone-900">Anti-Chute Radical</h4>
                  <p className="text-stone-500 text-xs mt-1">Fortifie la structure et scelle l'hydratation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-5 rounded-2xl shadow-sm border border-pink-100 hover:border-pink-300 transition duration-300">
                <span className="w-6 h-6 rounded-full bg-stone-950 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h4 className="font-extrabold text-sm text-stone-900">Pureté Organique</h4>
                  <p className="text-stone-500 text-xs mt-1">Sans produits toxiques, sans silicones ni sulfates.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-5 rounded-2xl shadow-sm border border-pink-100 hover:border-pink-300 transition duration-300">
                <span className="w-6 h-6 rounded-full bg-stone-950 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h4 className="font-extrabold text-sm text-stone-900">Livraison Suivie au Benin</h4>
                  <p className="text-stone-500 text-xs mt-1">Payez directement en espèces à la livraison chez vous.</p>
                </div>
              </div>
            </div>

            {/* Direct Conversion Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
              <a 
                href="#cures" 
                className="w-full sm:w-auto px-8 py-5 rounded-full text-center bg-stone-900 text-white hover:bg-stone-850 transition-all duration-300 font-extrabold tracking-widest text-sm uppercase shadow-xl flex items-center justify-center gap-3"
              >
                <ShoppingBag className="w-5 h-5 text-pink-400" />
                <span>Profiter des offres dès 10 000 FCFA</span>
              </a>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <img 
                    src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100&h=100" 
                    alt="Cliente Bénin" 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=100&h=100" 
                    alt="Client Bénin" 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1523825036634-a6225091a95a?auto=format&fit=crop&q=80&w=100&h=100" 
                    alt="Cliente Bénin" 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-pink-100 flex items-center justify-center text-[10px] font-bold text-pink-700 font-serif">+1k</div>
                </div>
                <div className="text-left">
                  <div className="flex items-center text-pink-500">
                    <Star className="w-4 h-4 fill-pink-500 text-pink-500" />
                    <Star className="w-4 h-4 fill-pink-500 text-pink-500" />
                    <Star className="w-4 h-4 fill-pink-500 text-pink-500" />
                    <Star className="w-4 h-4 fill-pink-500 text-pink-500" />
                    <Star className="w-4 h-4 fill-pink-500 text-pink-500" />
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5 font-semibold">4.9/5 recommandé par nos clientes au Benin</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Premium Interactive Product Photography */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Elegant luxury background decorations */}
            <div className="absolute w-72 h-72 rounded-full border border-pink-200 -top-10 -right-10 animate-pulse"></div>
            <div className="absolute w-80 h-80 rounded-full bg-pink-50 -bottom-10 -left-10 blur-3xl"></div>

            <div className="relative max-w-sm w-full bg-pink-50/50 p-4 rounded-3xl shadow-2xl border border-pink-100 group overflow-hidden">
              <div className="absolute top-6 left-6 z-10 bg-pink-500 text-white text-[10px] font-bold tracking-widest uppercase px-3.5 py-2 rounded-full shadow-lg">
                Bestseller
              </div>
              
              <img 
                src={bottleImg} 
                alt="Golden Circle Hair Growth Oil Flacon" 
                className="w-full h-auto object-cover rounded-2xl bg-white transition duration-700 hover:scale-105"
              />

              <div className="mt-4 p-4 bg-white rounded-2xl border border-pink-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-pink-600">Soin Capillaire</span>
                  <h3 className="font-serif font-black text-xl text-stone-900">Golden Circle</h3>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 line-through text-xs block">15 000 FCFA</span>
                  <p className="text-pink-600 font-black text-xl font-sans">10 000 FCFA</p>
                </div>
              </div>

              {/* Glowing decorative indicator */}
              <div className="absolute bottom-28 right-8 bg-[#391CB7] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-pink-300">
                <Sparkles className="w-4 h-4 fill-white text-white" />
                <span className="text-xs font-bold uppercase tracking-wider">100% Organique</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Core Trust Badges in Pink Theme */}
      <section className="bg-white py-12 border-y border-pink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center p-2">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 mb-4 shadow-inner border border-pink-100">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-stone-900">Paiement a la livraison</h4>
            <p className="text-stone-500 text-xs mt-1.5 max-w-[200px] mx-auto">Securite maximale, payez directement le livreur.</p>
          </div>

          <div className="flex flex-col items-center p-2">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 mb-4 shadow-inner border border-pink-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-stone-900">Formule Naturelle Pure</h4>
            <p className="text-stone-500 text-xs mt-1.5 max-w-[200px] mx-auto">Sans aucun produit chimique nocif ni silicone.</p>
          </div>

          <div className="flex flex-col items-center p-2">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 mb-4 shadow-inner border border-pink-100">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-stone-900">Resultats des 14 jours</h4>
            <p className="text-stone-500 text-xs mt-1.5 max-w-[200px] mx-auto">Cuir chevelu apaise et arret immediat de la casse.</p>
          </div>

          <div className="flex flex-col items-center p-2">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 mb-4 shadow-inner border border-pink-100">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-stone-900">Conseils Personnalises</h4>
            <p className="text-stone-500 text-xs mt-1.5 max-w-[200px] mx-auto">Suivi de votre croissance continue sur WhatsApp.</p>
          </div>
        </div>
      </section>

      {/* 5. Modern Infinite Marquee Social Proof (SaaS style, no emojis) */}
      <section className="py-16 bg-pink-50/20 overflow-hidden border-b border-pink-100">
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-extrabold tracking-widest text-pink-600 block">Temoignages d'utilisateurs verifiables</span>
          <h3 className="font-serif text-2xl md:text-3xl font-bold mt-1 text-stone-950">Ce que disent nos clientes au Benin</h3>
        </div>
        <div className="relative w-full flex overflow-x-hidden">
          <div className="animate-marquee gap-6 py-4">
            {[...REVIEWS, ...REVIEWS].map((rev, i) => (
              <div 
                key={i} 
                className="w-80 md:w-96 p-6 bg-white rounded-3xl border border-pink-100 shadow-md flex-shrink-0 flex flex-col justify-between hover:border-pink-300 transition duration-300"
              >
                <div>
                  <div className="flex items-center gap-1 text-pink-500 mb-3">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                    ))}
                  </div>
                  <p className="text-stone-600 text-xs md:text-sm leading-relaxed italic">
                    "{rev.text}"
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-pink-50 flex items-center gap-3">
                  {rev.avatar ? (
                    <img 
                      src={rev.avatar} 
                      alt={rev.name} 
                      className="w-10 h-10 rounded-full object-cover border border-pink-100 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#391CB7] text-white flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                      {rev.name[0]}
                    </div>
                  )}
                  <div className="text-left">
                    <h5 className="font-bold text-xs text-stone-900">{rev.name}</h5>
                    <span className="text-[9px] text-stone-400">{rev.city}, Benin (Avis verifie)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Dynamic Bento Grid for Ingredients (Vibrant & Premium) */}
      <section id="ingredients" className="py-20 md:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-pink-600">Des actifs naturels rigoureusement selectionnes</span>
            <h2 className="font-serif text-3xl md:text-5xl font-extrabold mt-2 text-stone-950">L'alliance d'ingredients d'exception</h2>
            <p className="text-stone-500 text-sm md:text-base mt-4 font-light">
              Notre secret repose sur l'association d'actifs vegetaux bruts de premiere pression a froid pour nourrir durablement votre cuir chevelu.
            </p>
          </div>

          {/* Bento Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[230px]">
            
            {/* Castor Oil - Spans 2 rows and columns */}
            <div className="md:col-span-2 md:row-span-2 rounded-3xl border border-pink-100 bg-[#FFFDFE] p-8 flex flex-col justify-between hover:border-pink-300 transition duration-300 relative overflow-hidden group text-left">
              <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-10 group-hover:opacity-20 transition duration-500 pointer-events-none">
                <div className="w-full h-full bg-pink-400 blur-3xl rounded-full translate-x-20 translate-y-20"></div>
              </div>
              <div className="space-y-4 max-w-md z-10 text-left">
                <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 border border-pink-100">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-black text-stone-950">Huile de Ricin Pure Extra-Vierge</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Notre huile de ricin brute est extraite par premiere pression a froid pour preserver l'integralite de son acide ricinoleique. Elle fortifie instantanement la gaine du cheveu, comble les tempes clairsemees et nourrit en profondeur la racine.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-pink-600 uppercase tracking-wider z-10 text-left">
                <span>Concentration maximale en acides gras</span>
              </div>
            </div>

            {/* Rosemary & Mint */}
            <div className="rounded-3xl border border-pink-100 bg-white p-6 flex flex-col justify-between hover:border-pink-300 transition duration-300 text-left">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-lg font-bold text-stone-950">Romarin & Menthe Poivree</h4>
                <p className="text-stone-500 text-xs leading-relaxed">
                  Active la microcirculation sanguine au niveau du cuir chevelu pour accelerer l'apport de nutriments essentiels au bulbe.
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Activateur capillaire organique</span>
            </div>

            {/* Argan Oil */}
            <div className="rounded-3xl border border-pink-100 bg-white p-6 flex flex-col justify-between hover:border-pink-300 transition duration-300 text-left">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-lg font-bold text-stone-950">Huile d'Argan Organique</h4>
                <p className="text-stone-500 text-xs leading-relaxed">
                  Repare les longueurs abimees, elimine les fourches et apporte une douceur et une brillance naturelles durables.
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Protecteur & Revitalisant</span>
            </div>

            {/* Benin Service Highlights */}
            <div className="md:col-span-2 rounded-3xl border border-pink-100 bg-[#FFFDFE] p-6 flex flex-col justify-between hover:border-pink-300 transition duration-300 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#391CB7] flex items-center justify-center text-white">
                    <Truck className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-stone-950">Expedition direct au Benin</h4>
                  <p className="text-stone-500 text-xs leading-relaxed">
                    Nous livrons a Cotonou, Calavi, Porto-Novo, Parakou et toutes les autres localites du Benin avec un suivi par telephone.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-pink-100 text-center space-y-1">
                  <span className="text-[10px] text-pink-600 font-extrabold uppercase tracking-widest block">Délai Estimé</span>
                  <span className="text-2xl font-black text-stone-950">24h a 48h</span>
                  <span className="text-[9px] text-stone-400 block">Paiement apres verification du produit</span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Logistique Benin securisee</span>
            </div>

            {/* Vitamin E & Lavender */}
            <div className="rounded-3xl border border-pink-100 bg-white p-6 flex flex-col justify-between hover:border-pink-300 transition duration-300 text-left">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500">
                  <Heart className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-lg font-bold text-stone-950">Vitamine E & Lavande</h4>
                <p className="text-stone-500 text-xs leading-relaxed">
                  Apaise les irritations cutanees, purifie le cuir chevelu et elimine durablement les pellicules.
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Equilibre & Apaisement</span>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Infinite Left-to-Right Before/After Transformation Marquee (Conversion Booster) */}
      <section id="results" className="py-20 md:py-28 bg-[#FFFDFE] border-y border-pink-100 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-pink-600 block">Preuves réelles & transformations</span>
          <h2 className="font-serif text-3xl md:text-5xl font-extrabold mt-2 text-stone-950">Des Résultats Réels de Nos Clients</h2>
          <p className="text-stone-500 text-sm md:text-base mt-4 max-w-2xl mx-auto font-light">
            Découvrez les transformations spectaculaires et réelles de nos clients au Bénin. Les photos avant et après s'affichent au complet et défilent automatiquement de gauche à droite.
          </p>
        </div>

        {/* Left to Right Marquee Row */}
        <div className="relative w-full flex overflow-x-hidden mb-16">
          <div className="animate-marquee-reverse gap-8 py-4 flex">
            {[...REAL_CASES, ...REAL_CASES, ...REAL_CASES, ...REAL_CASES].map((item, idx) => (
              <div 
                key={idx} 
                className="w-[320px] sm:w-[460px] p-5 bg-white rounded-3xl border border-pink-100 shadow-lg hover:border-pink-300 transition duration-300 flex-shrink-0 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-extrabold text-pink-600 tracking-widest block">
                      Transformation Réelle
                    </span>
                    <div className="flex items-center gap-0.5 text-pink-500">
                      <Star className="w-3 h-3 fill-pink-500 text-pink-500" />
                      <Star className="w-3 h-3 fill-pink-500 text-pink-500" />
                      <Star className="w-3 h-3 fill-pink-500 text-pink-500" />
                      <Star className="w-3 h-3 fill-pink-500 text-pink-500" />
                      <Star className="w-3 h-3 fill-pink-500 text-pink-500" />
                    </div>
                  </div>
                  
                  <h4 className="font-serif font-extrabold text-sm sm:text-base text-stone-950 mb-3">
                    {item.title}
                  </h4>
                  
                  {/* Side-by-side Images (Fully visible/complete) */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Before Image */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-stone-100 bg-stone-950">
                      <img 
                        src={item.before} 
                        alt="Avant" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 z-10">
                        Avant
                      </span>
                    </div>

                    {/* After Image */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-pink-100 bg-stone-950">
                      <img 
                        src={item.after} 
                        alt="Après" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-2 right-2 bg-pink-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
                        Après <Sparkles className="w-2.5 h-2.5 fill-pink-500 text-pink-500" />
                      </span>
                    </div>
                  </div>

                  <p className="text-stone-600 text-xs leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Week-by-Week Action Timeline */}
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="bg-white rounded-3xl border border-pink-100 p-6 md:p-8 shadow-md">
            <h4 className="font-serif font-extrabold text-sm text-stone-950 uppercase tracking-wider mb-6 text-center">
              Chronologie de l'action de l'huile :
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3 bg-pink-50/10 p-3 rounded-2xl border border-pink-50/30">
                <span className="w-8 h-8 rounded-full bg-pink-50 text-[#391CB7] border border-pink-100 font-bold flex items-center justify-center flex-shrink-0 text-sm">1</span>
                <div>
                  <h5 className="font-bold text-xs text-stone-950">Semaine 2</h5>
                  <p className="text-stone-500 text-xs mt-0.5 font-light">Arrêt de la desquamation, cuir chevelu apaisé et racine hydratée.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-pink-50/10 p-3 rounded-2xl border border-pink-50/30">
                <span className="w-8 h-8 rounded-full bg-pink-50 text-[#391CB7] border border-pink-100 font-bold flex items-center justify-center flex-shrink-0 text-sm">2</span>
                <div>
                  <h5 className="font-bold text-xs text-stone-950">Semaine 4</h5>
                  <p className="text-stone-500 text-xs mt-0.5 font-light">Diminution de 85% de la casse des cheveux lors du peignage.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-pink-50/10 p-3 rounded-2xl border border-pink-50/30">
                <span className="w-8 h-8 rounded-full bg-pink-50 text-[#391CB7] border border-pink-100 font-bold flex items-center justify-center flex-shrink-0 text-sm">3</span>
                <div>
                  <h5 className="font-bold text-xs text-stone-950">Semaine 8</h5>
                  <p className="text-stone-500 text-xs mt-0.5 font-light">Repousses vigoureuses et denses sur les zones anciennement dégarnies.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. AI Hair Care Diagnostic Widget (SaaS-Style Trichologist) */}
      <section id="diagnostic" className="py-20 md:py-28 bg-[#FFF9FA] border-b border-pink-100 relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="px-3.5 py-1.5 bg-pink-500/10 border border-pink-500/20 rounded-full text-[10px] font-bold text-pink-600 uppercase tracking-widest inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Trichologie Assistee par Intelligence Artificielle
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-extrabold mt-3 text-stone-950">Votre Diagnostic Capillaire IA Offert</h2>
            <p className="text-stone-500 text-sm md:text-base mt-4 max-w-xl mx-auto font-light">
              Répondez à 3 questions sur la texture de vos cheveux et l'état de votre cuir chevelu pour obtenir votre prescription personnalisée et optimiser les résultats de votre cure.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-pink-100 relative overflow-hidden">
            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    diagnosticStep === step 
                      ? 'bg-stone-900 text-white ring-4 ring-pink-500/20 scale-110 border border-pink-300' 
                      : diagnosticStep > step 
                        ? 'bg-pink-600 text-white' 
                        : 'bg-stone-100 text-stone-400'
                  }`}>
                    {diagnosticStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 4 && <div className={`w-12 h-1 ${diagnosticStep > step ? 'bg-pink-600' : 'bg-stone-100'}`}></div>}
                </div>
              ))}
            </div>

            {/* STEP 1: Hair Type */}
            {diagnosticStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-stone-950">1. Quel est votre type naturel de cheveux ?</h3>
                  <p className="text-stone-400 text-xs mt-1">Selectionnez la texture qui vous correspond</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'Crepus (4A / 4B / 4C)', label: 'Crepus / Afro', desc: 'Boucles tres serrees en spirale ou forme de Z' },
                    { key: 'Boucles (3A / 3B / 3C)', label: 'Boucles / Frises', desc: 'Boucles bien definies en spirale souple' },
                    { key: 'Ondules (2A / 2B / 2C)', label: 'Ondules', desc: 'Forme de S souple, sensible a l\'humidite' },
                    { key: 'Lisses', label: 'Lisses', desc: 'Cheveux droits sans vagues ni ondulations' }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setDiagnosticAnswers({...diagnosticAnswers, hairType: opt.key});
                        setDiagnosticStep(2);
                      }}
                      className={`p-5 text-left rounded-2xl border transition-all duration-200 hover:border-pink-550 hover:bg-pink-50/10 group ${
                        diagnosticAnswers.hairType === opt.key ? 'border-pink-500 bg-pink-50/20 ring-2 ring-pink-500/10' : 'border-stone-100'
                      }`}
                    >
                      <h4 className="font-bold text-sm text-stone-950 group-hover:text-pink-600 transition">{opt.label}</h4>
                      <p className="text-stone-500 text-[11px] mt-1.5 leading-relaxed">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Scalp State */}
            {diagnosticStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-stone-950">2. Quel est l'etat actuel de votre cuir chevelu ?</h3>
                  <p className="text-stone-400 text-xs mt-1">Cela adapte la frequence optimale de massage de l'huile</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'Sec avec des pellicules', label: 'Sec / Pellicules', desc: 'Demangeaisons ou desquamations blanches frequentes' },
                    { key: 'Gras rapidement', label: 'Gras rapidement', desc: 'Exces de sebum a la racine des le lendemain du lavage' },
                    { key: 'Sensible et irrite', label: 'Sensible et irrite', desc: 'Tiraillements, rougeurs ou picotements reguliers' },
                    { key: 'Normal', label: 'Normal / Equilibre', desc: 'Sain, pas d\'exces de sebum ni de secheresse' }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setDiagnosticAnswers({...diagnosticAnswers, scalpState: opt.key});
                        setDiagnosticStep(3);
                      }}
                      className={`p-5 text-left rounded-2xl border transition-all duration-200 hover:border-pink-500 hover:bg-pink-50/10 group ${
                        diagnosticAnswers.scalpState === opt.key ? 'border-pink-500 bg-pink-50/20 ring-2 ring-pink-500/10' : 'border-stone-100'
                      }`}
                    >
                      <h4 className="font-bold text-sm text-stone-950 group-hover:text-pink-600 transition">{opt.label}</h4>
                      <p className="text-stone-500 text-[11px] mt-1.5 leading-relaxed">{opt.desc}</p>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between pt-4">
                  <button 
                    onClick={() => setDiagnosticStep(1)} 
                    className="text-stone-400 text-xs font-bold uppercase tracking-wider hover:text-stone-950 transition flex items-center gap-1"
                  >
                    Retour
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Main Concern */}
            {diagnosticStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-stone-950">3. Quel est votre objectif capillaire prioritaire ?</h3>
                  <p className="text-stone-400 text-xs mt-1">Nous adapterons la formulation d'actifs requise</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'Chute de cheveux importante et alopecie', label: 'Stopper la chute', desc: 'Perte anormale ou tempes completement degarnies' },
                    { key: 'Croissance extremement lente', label: 'Accelerer la pousse', desc: 'Les cheveux ne prennent plus de longueur depuis des mois' },
                    { key: 'Casse intense et pointes fourchues', label: 'Eliminer la casse', desc: 'Cheveux secs, reches, cassants aux extremites' },
                    { key: 'Manque cruel de volume et de densite', label: 'Gagner en epaisseur', desc: 'Cheveux fins, plats, qui manquent de matiere' }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setDiagnosticAnswers({...diagnosticAnswers, mainConcern: opt.key})}
                      className={`p-5 text-left rounded-2xl border transition-all duration-200 hover:border-pink-500 hover:bg-pink-50/10 group flex items-start justify-between ${
                        diagnosticAnswers.mainConcern === opt.key ? 'border-pink-500 bg-pink-50/20 ring-2 ring-pink-500/10' : 'border-stone-100'
                      }`}
                    >
                      <div className="text-left">
                        <h4 className="font-bold text-sm text-stone-950 group-hover:text-pink-600 transition">{opt.label}</h4>
                        <p className="text-stone-500 text-[11px] mt-1.5 leading-relaxed">{opt.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        diagnosticAnswers.mainConcern === opt.key ? 'border-pink-500 bg-pink-500 text-white' : 'border-stone-300'
                      }`}>
                        {diagnosticAnswers.mainConcern === opt.key && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-stone-100">
                  <button 
                    onClick={() => setDiagnosticStep(2)} 
                    className="text-stone-400 text-xs font-bold uppercase tracking-wider hover:text-stone-950 transition flex items-center gap-1"
                  >
                    Retour
                  </button>
                  <button
                    onClick={runDiagnostic}
                    disabled={isDiagnosticLoading || !diagnosticAnswers.mainConcern}
                    className="px-6 py-3 bg-stone-900 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-stone-850 transition flex items-center gap-2 shadow-md disabled:opacity-50"
                  >
                    {isDiagnosticLoading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                        <span>Analyse en cours...</span>
                      </>
                    ) : (
                      <>
                        <span>Obtenir mon diagnostic</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Diagnostic Results */}
            {diagnosticStep === 4 && diagnosticResult && (
              <div className="space-y-8 text-left">
                <div className="bg-pink-50/50 p-6 rounded-2xl border border-pink-200">
                  <div className="flex items-center gap-2 text-pink-700 mb-2 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 fill-pink-500 text-pink-500" />
                    <span>Synthese de notre Trichologue IA</span>
                  </div>
                  <h3 className="font-serif font-extrabold text-xl text-stone-950">Votre Profil de Soin Personnalise</h3>
                  <p className="text-stone-600 text-sm mt-3 leading-relaxed">
                    {diagnosticResult.diagnosticSummary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Routine usage */}
                  <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100">
                    <div className="flex items-center gap-2 mb-3 text-stone-950">
                      <Activity className="w-4 h-4 text-pink-600" />
                      <h4 className="font-bold text-xs uppercase tracking-wider">Votre routine recommandée</h4>
                    </div>
                    <ul className="space-y-3 text-xs text-stone-600">
                      <li>
                        <strong className="text-stone-950">Frequence :</strong> {diagnosticResult.routine.frequency}
                      </li>
                      <li>
                        <strong className="text-stone-950">Matin :</strong> {diagnosticResult.routine.morning}
                      </li>
                      <li>
                        <strong className="text-stone-950">Soir :</strong> {diagnosticResult.routine.evening}
                      </li>
                      <li>
                        <strong className="text-stone-950">Massage :</strong> {diagnosticResult.routine.massageTips}
                      </li>
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100">
                    <div className="flex items-center gap-2 mb-3 text-stone-950">
                      <Award className="w-4 h-4 text-pink-600" />
                      <h4 className="font-bold text-xs uppercase tracking-wider">Conseils d'experts capillaires</h4>
                    </div>
                    <ul className="space-y-3 text-xs text-stone-600 list-disc list-inside">
                      {diagnosticResult.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="leading-relaxed">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Timeline results */}
                <div className="p-5 bg-white rounded-2xl border border-stone-100 shadow-sm">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-950 mb-4 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-pink-600" /> Evolution chronologique estimee
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-600">
                    <div className="border-l-2 border-pink-500 pl-3 py-1">
                      <span className="font-bold text-stone-950 block">Semaine 2</span>
                      <p className="mt-1 font-light">{diagnosticResult.timeline.week2}</p>
                    </div>
                    <div className="border-l-2 border-pink-500 pl-3 py-1">
                      <span className="font-bold text-stone-950 block">Mois 1</span>
                      <p className="mt-1 font-light">{diagnosticResult.timeline.month1}</p>
                    </div>
                    <div className="border-l-2 border-pink-500 pl-3 py-1">
                      <span className="font-bold text-stone-950 block">Mois 3</span>
                      <p className="mt-1 font-light">{diagnosticResult.timeline.month3}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-100">
                  <button 
                    onClick={() => {
                      setDiagnosticStep(1);
                      setDiagnosticResult(null);
                    }} 
                    className="text-stone-400 text-xs font-bold uppercase tracking-wider hover:text-emerald-950 transition flex items-center gap-1.5"
                  >
                    <RotateCw className="w-3.5 h-3.5" /> Recommencer l'analyse
                  </button>
                  
                  <button
                    onClick={applyDiagnosticOffer}
                    className="w-full sm:w-auto px-8 py-4 bg-emerald-900 hover:bg-emerald-800 text-white transition rounded-full font-bold text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Appliquer aux tarifs promotionnels</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 9. Product Cures Selection (Vibrant & Push to 3-bottle option) */}
      <section id="cures-section" className="py-20 md:py-28 bg-white border-b border-pink-100">
        <div id="cures" className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-pink-600 block">Choix de votre cure de croissance</span>
            <h2 className="font-serif text-3xl md:text-5xl font-black text-stone-950 leading-tight">
              Combien de flacons de Golden Circle vous faut-il ?
            </h2>
            <div className="p-4 bg-pink-50/50 border border-pink-200 rounded-2xl max-w-2xl mx-auto text-left flex items-start gap-3">
              <Info className="w-5 h-5 text-pink-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-pink-950 leading-relaxed font-semibold">
                <strong className="block text-stone-950">Conseil d'Application :</strong> La régularité et la continuité de l'application de l'huile Golden Circle sont indispensables pour réveiller les bulbes capillaires endormis. Plus l'application est constante et sans interruption, plus vite vous obtiendrez des résultats visibles et durables. C'est pourquoi nous recommandons d'opter pour plusieurs flacons identiques afin de poursuivre votre routine sereinement sans aucune pause.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {CURES.map((cure) => {
              const isRecommended = cure.id === 'cure_3';
              return (
                <div 
                  key={cure.id}
                  onClick={() => setSelectedCure(cure)}
                  className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer text-left border ${
                    selectedCure.id === cure.id 
                      ? 'border-pink-500 bg-pink-50/10 ring-2 ring-pink-500/10 scale-102 shadow-xl' 
                      : 'border-stone-200/80 bg-white hover:border-pink-500/40 shadow-sm'
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#391CB7] text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                      Choix Recommandé & Garantie Totale
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full border ${cure.tagColor}`}>
                        {cure.badgeText}
                      </span>
                      {selectedCure.id === cure.id && (
                        <span className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-serif text-xl font-extrabold text-stone-950">{cure.name}</h3>
                      <p className="text-stone-400 text-xs">{cure.volume}</p>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-stone-950">{cure.price.toLocaleString('fr-FR')} FCFA</span>
                        <span className="text-stone-400 line-through text-sm">{cure.originalPrice.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      <span className="text-pink-700 text-xs font-bold block mt-1 bg-pink-50 px-2 py-0.5 rounded-md inline-block">
                        {cure.discountLabel}
                      </span>
                    </div>

                    <p className="text-stone-600 text-xs leading-relaxed font-light border-t border-stone-100 pt-4">
                      {cure.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCure(cure);
                        showToast(`Cure "${cure.name}" sélectionnée !`, "success");
                      }}
                      className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                        selectedCure.id === cure.id 
                          ? 'bg-[#391CB7] text-white shadow-md scale-105' 
                          : 'bg-stone-50 hover:bg-pink-50/30 text-stone-950 border border-[#391CB7]/20 hover:border-[#391CB7]/50'
                      }`}
                    >
                      {selectedCure.id === cure.id ? 'Cure Sélectionnée ✓' : 'Sélectionner cette cure'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Core Guarantee banner */}
          <div className="mt-12 p-6 bg-pink-50/10 border border-pink-100 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-pink-50/50 flex items-center justify-center text-pink-600 border border-pink-100 flex-shrink-0 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-extrabold text-base text-stone-950">Garantie Repousse Satisfait ou Remboursé</h4>
                <p className="text-stone-500 text-xs mt-0.5">Nous sommes tellement confiants en l'efficacité de Golden Circle que nous vous offrons une garantie de satisfaction totale.</p>
              </div>
            </div>
            <a 
              href="#order-form-container" 
              className="px-8 py-4 bg-stone-900 text-white hover:bg-stone-800 transition rounded-full text-xs font-extrabold uppercase tracking-widest shadow-md flex items-center gap-2"
            >
              Passer à l'étape de livraison
            </a>
          </div>

        </div>
      </section>

      {/* 10. Ordering Form Section - Fully Integrated Shipping Calculator */}
      <section id="order-form-container" className="py-20 bg-stone-50 border-b border-pink-100 text-left">
        <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-pink-600 block">Dernière étape de votre commande</span>
              <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-stone-950">Informations de livraison</h2>
              <p className="text-stone-500 text-sm font-light">
                Entrez vos coordonnées ci-dessous pour préparer l'expédition de votre colis. Aucun paiement en ligne n'est requis. Vous payez en espèces à la livraison chez vous.
              </p>
            </div>

            <form onSubmit={handleSubmitOrder} className="bg-white p-6 md:p-8 rounded-3xl border border-pink-100 shadow-lg space-y-6">
              
              {/* Product chosen snapshot */}
              <div className="p-4 bg-pink-50/10 rounded-2xl border border-pink-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-pink-700">Cure sélectionnée :</span>
                  <h4 className="font-serif font-bold text-sm text-stone-950">{selectedCure.name}</h4>
                  <p className="text-stone-400 text-xs mt-0.5">{selectedCure.volume}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-400 line-through block">{selectedCure.originalPrice.toLocaleString('fr-FR')} FCFA</span>
                  <span className="font-bold text-sm text-pink-600">{selectedCure.price.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-stone-950 uppercase tracking-wider block">Votre Nom et Prénom :</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input 
                    type="text" 
                    required
                    placeholder="Exemple: Amina Soglo"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-pink-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-stone-950 uppercase tracking-wider block">Numéro de téléphone actif (WhatsApp) :</label>
                <div className="flex">
                  <span className={`inline-flex items-center px-3.5 bg-stone-100 border ${phoneError ? 'border-red-400' : 'border-stone-200'} border-r-0 rounded-l-xl text-xs font-extrabold text-stone-600 transition-colors`}>
                    +229
                  </span>
                  <input 
                    type="tel" 
                    required
                    placeholder="Exemple: 0196xxxxxx ou 90xxxxxx"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className={`w-full px-4 py-3 bg-stone-50 border ${phoneError ? 'border-red-400 focus:border-red-500' : 'border-stone-200 focus:border-pink-500'} rounded-r-xl text-sm focus:outline-none focus:bg-white transition`}
                  />
                </div>
                {phoneError ? (
                  <p className="text-red-600 text-[11px] font-bold mt-1 flex items-center gap-1.5 animate-pulse">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                    {phoneError}
                  </p>
                ) : (
                  <span className="text-[10px] text-stone-400">Le livreur vous appellera sur ce numéro avant de se présenter chez vous.</span>
                )}
              </div>

              {/* City Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-stone-950 uppercase tracking-wider block">Ville de livraison :</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full pl-10 pr-8 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-pink-500 focus:bg-white transition appearance-none cursor-pointer font-semibold text-stone-950"
                    >
                      {BENIN_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="Autre">Autre Ville (A préciser)</option>
                    </select>
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 pointer-events-none">
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {formData.city === 'Autre' && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-xs font-extrabold text-stone-950 uppercase tracking-wider block">Précisez votre Ville :</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Tanguiéta, Grand-Popo"
                      value={formData.customCity}
                      onChange={(e) => setFormData({...formData, customCity: e.target.value})}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-pink-500 focus:bg-white transition"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-stone-950 uppercase tracking-wider block">Quartier / Adresse précise :</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Fidjrossè, rue de l'Étoile Rouge"
                    value={formData.address}
                    onChange={(e) => {
                      setFormData({...formData, address: e.target.value});
                      if (e.target.value.trim()) {
                        setAddressError(null);
                      }
                    }}
                    className={`w-full px-4 py-3 bg-stone-50 border ${addressError ? 'border-red-400 focus:border-red-500' : 'border-stone-200 focus:border-pink-500'} rounded-xl text-sm focus:outline-none focus:bg-white transition`}
                  />
                  {addressError && (
                    <p className="text-red-600 text-[11px] font-bold mt-1 flex items-center gap-1.5 animate-pulse">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                      {addressError}
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-stone-950 uppercase tracking-wider block">Note pour le livreur (Optionnel) :</label>
                <textarea 
                  placeholder="Ex: Livrer de préférence l'après-midi, appeler 30 min à l'avance..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-pink-500 focus:bg-white transition h-20 resize-none"
                />
              </div>

              {/* High converting CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-5 rounded-full bg-[#391CB7] hover:bg-pink-600 text-white font-extrabold text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all duration-300 border border-white/20"
                >
                  <ShoppingBag className="w-5 h-5 text-white" />
                  <span>Confirmer & Commander sur WhatsApp</span>
                </button>
                <span className="text-[10px] text-stone-400 text-center block mt-3 font-semibold">
                  En cliquant, votre commande est sauvegardée et le message de confirmation se remplit automatiquement sur votre WhatsApp.
                </span>
              </div>

            </form>
          </div>

          {/* Checkout Breakdown Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-pink-100 shadow-lg space-y-6">
              <h3 className="font-serif font-extrabold text-lg text-stone-950">Synthèse de votre commande</h3>
              
              <div className="divide-y divide-stone-100 text-xs">
                
                {/* Product cost */}
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500">Cure choisie :</span>
                  <span className="font-extrabold text-stone-950 text-right">
                    {selectedCure.name}
                    <span className="block text-[10px] font-normal text-stone-400">{selectedCure.volume}</span>
                  </span>
                </div>

                <div className="py-3 flex justify-between">
                  <span className="text-stone-500">Prix unitaire flacon :</span>
                  <span className="font-bold text-stone-700">10 000 FCFA</span>
                </div>

                {/* Subtotal */}
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500">Sous-total :</span>
                  <span className="font-bold text-stone-700">{selectedCure.price.toLocaleString('fr-FR')} FCFA</span>
                </div>

                {/* Shipping */}
                <div className="py-3 flex justify-between items-center">
                  <span className="text-stone-500 flex items-center gap-1">
                    Frais de livraison ({formData.city === 'Autre' ? 'Autre' : formData.city}) :
                  </span>
                  <span className={`font-bold ${activeShippingFee === 0 ? 'text-pink-600' : 'text-stone-700'}`}>
                    {activeShippingFee === 0 ? 'Gratuit' : `${activeShippingFee.toLocaleString('fr-FR')} FCFA`}
                  </span>
                </div>

                {/* Applied diagnostic gift */}
                {diagnosticApplied && (
                  <div className="py-3 flex justify-between items-center text-pink-700 font-bold bg-pink-50 p-2 rounded-lg gap-2">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 fill-pink-500 text-pink-500" />
                      Cadeau Diagnostic IA appliqué :
                    </span>
                    <span>Brosse Stimulante Capillaire Offerte</span>
                  </div>
                )}

                {/* Estimated Delivery time */}
                <div className="py-3 text-[11px] text-pink-700 bg-pink-50/40 p-3 rounded-xl border border-pink-100 flex items-start gap-2">
                  <Truck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Délai estimé :</strong> {getDeliveryEst(formData.city)}
                  </span>
                </div>

                {/* Total amount */}
                <div className="py-4 flex justify-between items-baseline pt-4 border-t-2 border-dashed border-stone-200">
                  <span className="text-sm font-extrabold text-stone-950">TOTAL A PAYER :</span>
                  <span className="text-2xl font-black text-stone-950">{finalTotalAmount.toLocaleString('fr-FR')} FCFA</span>
                </div>

              </div>

              {/* Cash on delivery reassurance banner */}
              <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 space-y-2">
                <div className="flex items-center gap-2 text-[#A37B1F] font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>SÉCURITÉ ABSOLUE</span>
                </div>
                <p className="text-[10px] text-stone-600 leading-relaxed font-light">
                  Aucun prélèvement bancaire. Vous remettez le montant exact en espèces directement au livreur après avoir reçu et vérifié votre commande.
                </p>
              </div>

            </div>

            {/* Micro-Reviews sidebar proof */}
            <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-lg space-y-4">
              <div className="flex items-center gap-2 font-serif font-bold text-sm text-stone-950">
                <Users className="w-4 h-4 text-pink-500" />
                <span>Rappels Clients Reçus</span>
              </div>
              <div className="space-y-4">
                <div className="border-l-2 border-[#391CB7] pl-3 py-0.5 text-xs">
                  <p className="italic text-stone-600">"L'efficacité avec la Cure Complete de 3 flacons est extraordinaire. Mes tempes dégarnies depuis des mois sont redevenues denses en seulement 4 semaines."</p>
                  <span className="block mt-1 font-bold text-stone-950">Amina S., Cotonou</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 11. FAQ Accordion Section */}
      <section className="py-20 md:py-28 bg-white border-b border-pink-100 text-left">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-pink-600 block">Questions fréquentes</span>
            <h2 className="font-serif text-3xl md:text-5xl font-extrabold mt-2 text-stone-950">Tout savoir sur Golden Circle</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Combien de temps dure un flacon de Golden Circle ?",
                a: "La durée d'un flacon dépend entièrement de votre fréquence d'utilisation personnelle et de la taille de la zone à traiter. Tous nos flacons contiennent exactement le même produit et le même volume (100ml). Pour une application continue sans risque d'interruption de votre routine capillaire, nous vous suggérons d'opter pour nos offres de plusieurs flacons."
              },
              {
                q: "Quel est l'avantage de commander 2 ou 3 flacons à la fois ?",
                a: "Chaque flacon est absolument identique en formule et en dimension (100ml). En choisissant nos options duo ou trio, vous bénéficiez d'une réduction progressive importante sur le prix de chaque flacon. De plus, disposer d'une réserve vous permet de nourrir vos bulbes capillaires de manière constante et régulière, ce qui accélère et consolide les résultats de repousse."
              },
              {
                q: "Comment se deroule la livraison au Benin ?",
                a: "La livraison se fait a domicile ou a votre bureau sous 24h a 48h. Une fois votre commande validee sur WhatsApp, notre service client vous appelle pour fixer l'heure et l'endroit exact de la livraison. Vous payez directement en espèces au livreur."
              },
              {
                q: "L'huile convient-elle aux cheveux crepus naturels, decolores ou tresses ?",
                a: "Oui, Golden Circle est developpee specifiquement pour s'adapter a toutes les textures de cheveux d'Afrique (crepus, boucles, defrises, tresses, locks). Sa purete organique preserve l'elasticite de la fibre sans l'alourdir ni l'asphyxier."
              },
              {
                q: "L'huile capillaire Golden Circle presente-t-elle des effets secondaires ?",
                a: "Aucun. Notre formulation est 100% organique, sans silicones, sans huiles minerales, sans sulfates et sans parabenes. Elle convient parfaitement aux adultes de tous ages et aux adolescents."
              }
            ].map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl border border-stone-200/80 overflow-hidden transition-all duration-200 bg-[#FCFAF6]"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-serif font-extrabold text-sm md:text-base text-emerald-950 hover:bg-emerald-50/20 transition-all duration-300"
                  >
                    <span>{faq.q}</span>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-900 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-stone-600 text-xs md:text-sm leading-relaxed font-light border-t border-stone-100 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 12. Elegant Footer & Benin Local Contact Information */}
      <footer className="bg-stone-950 text-white py-6 text-left border-t border-pink-900/10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(57,28,183,0.08),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 relative">
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <GoldenCircleLogo className="w-6 h-6" />
              <span className="font-serif text-lg font-black tracking-widest text-[#391CB7]">
                GOLDEN <span className="font-sans text-white">CIRCLE</span>
              </span>
            </div>
            <p className="text-stone-400 text-[10px] leading-relaxed max-w-sm font-light">
              Le meilleur de la trichologie naturelle pour redonner force, épaisseur et longueur aux cheveux d'Afrique.
            </p>
          </div>

          <div className="text-[10px] text-stone-400 font-light space-y-1">
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-pink-500" />
              <span>Fidjrossè, Cotonou, Bénin</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-pink-500" />
              <span>Service client : +229 01 92 57 06 65</span>
            </p>
          </div>

          <div className="text-[10px] text-stone-500 font-light flex flex-col items-start md:items-end gap-1">
            <p>© 2026 Golden Circle. Tous droits réservés.</p>
            <div className="flex gap-4">
              <span>Paiement à la Livraison (COD)</span>
              <span>Trichologie Organique Certifiée</span>
            </div>
          </div>

        </div>
      </footer>

      {/* 13. Social Proof Live Notification Purchase Ticker */}
      <AnimatePresence>
        {recentPurchase && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 bg-white p-4 rounded-2xl shadow-2xl border border-pink-100 flex items-center gap-3.5 max-w-sm text-left"
          >
            <div className="w-10 h-10 rounded-full bg-stone-950 text-pink-500 flex items-center justify-center font-extrabold text-sm uppercase flex-shrink-0 border border-pink-100 shadow-inner">
              {recentPurchase.name[0]}
            </div>
            <div>
              <p className="text-xs font-extrabold text-stone-950">
                {recentPurchase.name} ({recentPurchase.city}, Bénin)
              </p>
              <p className="text-[10px] text-stone-500 mt-0.5 font-light">
                Vient de commander la <span className="font-semibold text-pink-600">{recentPurchase.cure.name}</span>
              </p>
              <span className="text-[9px] text-stone-400 block mt-1">
                Il y a {recentPurchase.minutes} minutes - Livré par COD
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 14. ADMIN SELLER DASHBOARD SIDEBAR (Overlay) */}
      <AnimatePresence>
        {showAdmin && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdmin(false)}
              className="absolute inset-0 bg-black"
            />
            {/* Sidebar Container */}
            <motion.div 
              initial={{ translateX: '100%' }}
              animate={{ translateX: '0%' }}
              exit={{ translateX: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col text-left z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-emerald-950 text-white">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#FCD34D]" />
                  <div>
                    <h3 className="font-serif font-extrabold text-lg">Espace Gestion Vendeur</h3>
                    <span className="text-[10px] text-emerald-300 font-light">Suivi local des commandes au Benin</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAdmin(false)}
                  className="p-1 rounded-full hover:bg-emerald-900 transition text-stone-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stats Bar */}
              <div className="p-4 bg-stone-50 border-b border-stone-100 grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-white rounded-xl border border-stone-200/60 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Commandes</span>
                  <span className="text-xl font-extrabold text-emerald-950 mt-1 block">{adminStats.totalOrders}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-200/60 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Chiffre d'Affaire</span>
                  <span className="text-xl font-extrabold text-emerald-700 mt-1 block">{adminStats.totalRevenue.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              {/* Controls & Refresh */}
              <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400">Commandes recentes (Cash on Delivery)</h4>
                <button 
                  onClick={fetchOrders}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-lg font-bold transition flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Actualiser
                </button>
              </div>

              {/* Orders List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {adminLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center text-stone-400 gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-emerald-900/30 border-t-emerald-900 animate-spin"></div>
                    <span className="text-xs">Chargement des donnees...</span>
                  </div>
                ) : adminOrders.length === 0 ? (
                  <div className="py-20 text-center text-stone-400 text-xs space-y-2">
                    <AlertCircle className="w-8 h-8 mx-auto text-stone-300" />
                    <p>Aucune commande enregistree pour le moment.</p>
                  </div>
                ) : (
                  adminOrders.map((order) => (
                    <div 
                      key={order.id}
                      className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-3 hover:border-emerald-500/20 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-stone-400">ID: #{order.id.slice(0, 8)}</span>
                        <button
                          onClick={() => {
                            updateOrderStatus(order.id, order.status || 'Nouveau');
                          }}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
                            order.status === 'Livre' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : order.status === 'En cours'
                                ? 'bg-amber-100 text-[#B8860B]'
                                : order.status === 'Annule'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          Status : {order.status || 'Nouveau'}
                        </button>
                      </div>

                      <div className="text-xs space-y-1">
                        <p><strong className="text-emerald-950">Client :</strong> {order.customer_name}</p>
                        <p><strong className="text-emerald-950">Telephone :</strong> {order.customer_phone}</p>
                        <p><strong className="text-emerald-950">Localisation :</strong> {order.city} - {order.address}</p>
                        <p><strong className="text-emerald-950">Option :</strong> {order.bundle_name} (Qté: {order.quantity})</p>
                        {order.notes && <p className="text-stone-500 italic mt-1"><strong className="text-emerald-950 not-italic">Note :</strong> {order.notes}</p>}
                      </div>

                      <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-950">
                          A payer : {order.total_price?.toLocaleString('fr-FR')} FCFA
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const clipboardText = `Commande #${order.id.slice(0,8)}:\nClient: ${order.customer_name}\nTel: ${order.customer_phone}\nVille: ${order.city}\nAdresse: ${order.address}\nOption: ${order.bundle_name}\nMontant: ${order.total_price} FCFA`;
                              navigator.clipboard.writeText(clipboardText);
                              setCopiedOrderId(order.id);
                              setTimeout(() => setCopiedOrderId(null), 2000);
                            }}
                            className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg transition"
                            title="Copier les details"
                          >
                            {copiedOrderId === order.id ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          
                          <a
                            href={`https://wa.me/${order.customer_phone?.replace(/[+\s]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-emerald-900 text-white text-[10px] rounded-lg font-bold flex items-center gap-1 hover:bg-emerald-800 transition"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 15. CUSTOM PREMIUM TOAST NOTIFICATION OVERLAY */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm border ${
              toast.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                : toast.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : 'bg-stone-50 border-stone-200 text-stone-950'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-stone-600 flex-shrink-0" />
            )}
            <span className="text-xs font-bold font-sans-premium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 16. SECURE ADMIN PASSWORD AUTHENTICATION MODAL */}
      <AnimatePresence>
        {showAdminAuth && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminAuth(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl text-left border border-stone-100 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#391CB7]" />
              
              <button
                onClick={() => setShowAdminAuth(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 transition text-stone-400 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#391CB7]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-black text-stone-900">Accès Administrateur</h3>
                  <p className="text-[10px] text-stone-400">Section réservée aux gestionnaires de commandes</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchOrders(adminPasswordInput);
                }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Mot de passe de gestion
                  </label>
                  <input
                    type="password"
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="Saisissez le mot de passe..."
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-pink-500 focus:bg-white rounded-xl text-stone-900 text-sm outline-none transition font-sans-premium"
                    autoFocus
                  />
                </div>

                {adminAuthError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-rose-800">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] leading-relaxed font-semibold">{adminAuthError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full py-3.5 bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  {adminLoading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <span>Valider & Accéder</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 17. FLOATING WHATSAPP BUTTON (Service Client) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {/* Decorative dynamic notification tooltip */}
        <div className="bg-white text-stone-900 border border-stone-100 shadow-xl px-3 py-1.5 rounded-2xl text-[10px] sm:text-xs font-bold flex items-center gap-1.5 animate-bounce mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Besoin d'aide ? Écrivez-nous !</span>
        </div>
        <a 
          href={`https://wa.me/${BENIN_WHATSAPP}?text=${encodeURIComponent("Bonjour, j'aimerais avoir plus d'informations sur vos produits de soin capillaire Golden Circle.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center border border-white/20 relative group cursor-pointer"
          title="Discuter sur WhatsApp"
        >
          {/* Ripple effect */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/20 animate-ping pointer-events-none" />
          <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
        </a>
      </div>

    </div>
  );
}
