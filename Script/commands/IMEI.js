module.exports.config = {
  name: "mi",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "—͟͟͞͞𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️",
  description: "IMEI সিমুলেটর — বাস্তব ট্র্যাকিং নয়। (শিক্ষা/টেস্টিং উদ্দেশ্যে)",
  commandCategory: "Tool",
  usages: ".imei <imei_number>",
  cooldowns: 10,
  dependencies: {}
};

// বাংলা সময় ফরম্যাটার (Asia/Dhaka)
function formatDateForDhaka(date = new Date()) {
  try {
    const options = {
      timeZone: "Asia/Dhaka",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    };
    return new Intl.DateTimeFormat("bn-BD", options).format(date);
  } catch (e) {
    // Simple fallback
    const d = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    return d.toISOString();
  }
}

// একটি সহজ হ্যাশ যাতে একই IMEI-এ একই "সিমুলেটেড" লোকেশন ফিরবে
function simpleHashToIndex(str, max) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h) % max;
}

module.exports.run = async ({ api, event, args }) => {
  try {
    const imei = args[0];
    if (!imei) {
      return api.sendMessage("দয়া করে IMEI নম্বর দিন। উদাহরণ: `.imei 123456789012345`", event.threadID, event.messageID);
    }

    // সাধারন IMEI ভ্যালিডেশন — সম্পূর্ণ সংখ্যার 15 ডিজিট
    if (!/^[0-9]{15}$/.test(imei)) {
      // কিন্তু আমরা টেস্ট আইডি (TEST-IMEI-...) হলে গ্রহণ করব (সিমুলেশন)
      if (!/^TEST-IMEI-[0-9]+$/.test(imei)) {
        return api.sendMessage("অবৈধ IMEI ফরম্যাট। বাস্তব IMEI সাধারণত 15 সংখ্যার হয়। টেস্টে `TEST-IMEI-00001` ব্যবহার করো অথবা 15 সংখ্যার IMEI দাও।", event.threadID, event.messageID);
      }
    }

    // যদি এখানে আসো — সিমুলেশন তৈরি করা হবে
    const cities = [
      { name_bn: "ঢাকা", name_en: "Dhaka", lat: 23.8103, lon: 90.4125 },
      { name_bn: "চট্টগ্রাম", name_en: "Chattogram", lat: 22.3569, lon: 91.7832 },
      { name_bn: "খুলনা", name_en: "Khulna", lat: 22.8456, lon: 89.5403 },
      { name_bn: "রাজশাহী", name_en: "Rajshahi", lat: 24.3636, lon: 88.6241 },
      { name_bn: "সিলেট", name_en: "Sylhet", lat: 24.8949, lon: 91.8687 },
      { name_bn: "বরিশাল", name_en: "Barishal", lat: 22.7010, lon: 90.3535 },
      { name_bn: "রংপুর", name_en: "Rangpur", lat: 25.7439, lon: 89.2752 },
      { name_bn: "ময়মনসিংহ", name_en: "Mymensingh", lat: 24.7471, lon: 90.4203 }
    ];

    // একই IMEI হলে একই ইনডেক্স পাবার জন্য হ্যাশ
    const idx = simpleHashToIndex(imei, cities.length);
    const city = cities[idx];

    // ছোট র‍্যান্ডম অফসেট যাতে একটু ভ্যারিয়েশন থাকে কিন্তু পুনরাবৃত্ত হবে না সম্পূর্ণ
    const seeded = simpleHashToIndex(imei + "_seed", 1000);
    const latOffset = (seeded % 100) / 10000; // ~0.0000 - 0.01
    const lonOffset = ((seeded + 37) % 100) / 10000;

    const lat = +(city.lat + (Math.random() * 2 - 1) * 0.005 + latOffset).toFixed(6);
    const lon = +(city.lon + (Math.random() * 2 - 1) * 0.005 + lonOffset).toFixed(6);

    // একটি আনুমানিক অ্যাকুরেসি (সিমুলেটেড)
    const accuracyKm = (1 + (simpleHashToIndex(imei, 10) / 10)).toFixed(2);

    const now = new Date();
    const timestamp = formatDateForDhaka(now);

    const message =
      `🔎 IMEI সিমুলেশন ফলাফল\n\n` +
      `IMEI: ${imei}\n` +
      `লোকেশন (সিমুলেটেড): ${city.name_bn} (${city.name_en})\n` +
      `সমন্বয়: ${lat}, ${lon}\n` +
      `অনুমানিক সঠিকতা: প্রায় ${accuracyKm} কিমি\n` +
      `সময়: ${timestamp}\n\n` +
      `⚠️ নোট: এটি একটি পুরোপুরি সিমুলেটেড তথ্য — বাস্তব ডিভাইস ট্র্যাক করা হয়নি এবং এই তথ্য বৈধ জারা/আধিকারিক কাজে ব্যবহার করা যাবে না।\n` +
      `বাস্তব ডিভাইস লোকেশন জানতে হলে সর্বোত্তম ও বৈধ পথগুলো: Google "Find My Device", Apple "Find My", ডিভাইস মালিকের সম্মতি, বা মোবাইল অপারেটরের আইনি প্রক্রিয়া।`;

    return api.sendMessage(message, event.threadID, event.messageID);

  } catch (err) {
    console.error("IMEI-sim error:", err);
    return api.sendMessage(`ত্রুটি: ${err.message || "অজানা ত্রুটি"}`, event.threadID, event.messageID);
  }
};
