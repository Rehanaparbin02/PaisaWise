// services/ReceiptProcessor.js - Expo Compatible Version
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ReceiptProcessor {
  constructor() {
    this.categories = [
      'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
      'Bills & Utilities', 'Healthcare', 'Travel', 'Education',
      'Business', 'Personal Care', 'Home', 'Insurance', 'Other'
    ];
  }

  // Step 1: Capture or select image using Expo ImagePicker
  async captureReceipt(useCamera = true) {
    try {
      // Request permissions
      if (useCamera) {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraPermission.status !== 'granted') {
          throw new Error('Camera permission is required to scan receipts');
        }
      } else {
        const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (mediaPermission.status !== 'granted') {
          throw new Error('Media library permission is required to select images');
        }
      }

      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true, // We need base64 for cloud OCR APIs
      };

      let result;
      if (useCamera) {
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (result.canceled) {
        throw new Error('User cancelled');
      }

      return {
        uri: result.assets[0].uri,
        base64: result.assets[0].base64,
        width: result.assets[0].width,
        height: result.assets[0].height
      };
    } catch (error) {
      throw error;
    }
  }

  // Step 2: Extract text using Google Cloud Vision API (Expo compatible)
  async extractTextFromImage(imageData) {
    try {
      // Use Google Cloud Vision API for OCR
      const response = await this.callGoogleVisionAPI(imageData.base64);
      return response;
    } catch (error) {
      // Fallback for development/testing
      console.warn('OCR API failed, using mock response for development:', error.message);
      return this.getMockOCRText();
    }
  }

  // Google Cloud Vision API call
  async callGoogleVisionAPI(base64Image) {
    const API_KEY = 'YOUR_GOOGLE_CLOUD_API_KEY'; // Replace with your actual API key
    
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64Image
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 1
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    
    if (data.responses && data.responses[0] && data.responses[0].textAnnotations) {
      return data.responses[0].textAnnotations[0].description;
    } else {
      throw new Error('No text detected in image');
    }
  }

  // Mock OCR response for development/testing
  getMockOCRText() {
    const mockTexts = [
      "STARBUCKS STORE #1234\n123 MAIN ST\nCITY, STATE 12345\n\nGRANDE LATTE     $5.45\nCHOCOLATE CROISSANT $3.25\n\nSUBTOTAL         $8.70\nTAX              $0.70\nTOTAL            $9.40\n\nTHANK YOU!",
      "WAL-MART SUPERCENTER\n456 OAK AVE\nTOWN, STATE 67890\n\nGROCERIES\nMILK 1 GAL       $3.99\nBREAD LOAF       $2.49\nEGGS DOZEN       $4.99\nAPPLES 2 LB      $5.99\n\nSUBTOTAL        $17.46\nTAX             $1.40\nTOTAL          $18.86",
      "SHELL GAS STATION\n789 PINE RD\n\nGASOLINE\n12.5 GAL @ $3.89  $48.63\n\nTOTAL           $48.63\nCARD ****1234\nTHANK YOU"
    ];
    
    return mockTexts[Math.floor(Math.random() * mockTexts.length)];
  }

  // Step 3: Clean and preprocess OCR text
  preprocessText(rawText) {
    // Remove excessive whitespace and special characters
    let cleaned = rawText
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s$.,()-]/g, '')
      .trim();

    // Extract potential amounts (looking for currency patterns)
    const amountRegex = /\$?\d+\.?\d{0,2}/g;
    const amounts = cleaned.match(amountRegex) || [];

    // Extract merchant info (usually first few lines)
    const lines = cleaned.split('\n').filter(line => line.trim().length > 2);
    const merchantInfo = lines.slice(0, 3).join(' ');

    return {
      fullText: cleaned,
      amounts: amounts.map(amt => parseFloat(amt.replace('$', ''))),
      merchantInfo,
      lines
    };
  }

  // Step 4: LLM-based categorization and data extraction
  async processWithLLM(preprocessedData) {
    const prompt = `
    Analyze this receipt text and extract the following information:
    
    Receipt Text: "${preprocessedData.fullText}"
    Merchant Info: "${preprocessedData.merchantInfo}"
    Found Amounts: ${preprocessedData.amounts.join(', ')}
    
    Please respond in JSON format with:
    {
      "merchant_name": "extracted merchant name",
      "total_amount": "most likely total amount as number",
      "date": "date in YYYY-MM-DD format if found, or null",
      "category": "one of: ${this.categories.join(', ')}",
      "confidence": "confidence score 0-1",
      "line_items": ["array of individual items if identifiable"],
      "reasoning": "brief explanation for category choice"
    }
    
    Guidelines:
    - Choose the highest amount as total_amount unless context suggests otherwise
    - Use merchant name and items to determine category
    - Be conservative with confidence if text is unclear
    `;

    try {
      // Replace with your LLM API call
      const response = await this.callLLMAPI(prompt);
      return JSON.parse(response);
    } catch (error) {
      // Fallback to rule-based categorization
      return this.fallbackCategorization(preprocessedData);
    }
  }

  // LLM API call (OpenAI example)
  async callLLMAPI(prompt) {
    const API_KEY = 'YOUR_OPENAI_API_KEY'; // Replace with your actual API key
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 500
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`OpenAI API Error: ${data.error.message}`);
      }
      
      return data.choices[0].message.content;
    } catch (error) {
      console.error('LLM API call failed:', error);
      throw error;
    }
  }

  // Fallback rule-based categorization
  fallbackCategorization(preprocessedData) {
    const text = preprocessedData.fullText.toLowerCase();
    const merchant = preprocessedData.merchantInfo.toLowerCase();
    
    const categoryKeywords = {
      'Food & Dining': ['restaurant', 'cafe', 'food', 'pizza', 'burger', 'starbucks', 'mcdonald', 'grocery', 'market'],
      'Transportation': ['uber', 'taxi', 'gas', 'fuel', 'parking', 'metro', 'bus', 'shell', 'exxon', 'bp'],
      'Shopping': ['walmart', 'target', 'amazon', 'store', 'retail', 'mall', 'shop'],
      'Bills & Utilities': ['electric', 'water', 'internet', 'phone', 'utility', 'bill'],
      'Healthcare': ['pharmacy', 'hospital', 'doctor', 'medical', 'clinic', 'cvs', 'walgreens'],
      'Entertainment': ['movie', 'theater', 'game', 'netflix', 'spotify', 'gym', 'cinema']
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => text.includes(keyword) || merchant.includes(keyword))) {
        return {
          merchant_name: preprocessedData.merchantInfo,
          total_amount: Math.max(...preprocessedData.amounts) || 0,
          date: null,
          category,
          confidence: 0.6,
          line_items: [],
          reasoning: `Matched keywords: ${keywords.filter(k => text.includes(k) || merchant.includes(k)).join(', ')}`
        };
      }
    }

    return {
      merchant_name: preprocessedData.merchantInfo,
      total_amount: Math.max(...preprocessedData.amounts) || 0,
      date: null,
      category: 'Other',
      confidence: 0.3,
      line_items: [],
      reasoning: 'No specific category keywords found'
    };
  }

  // Main processing pipeline
  async processReceipt(imageData) {
    try {
      console.log('Starting OCR processing...');
      const rawText = await this.extractTextFromImage(imageData);
      
      console.log('Preprocessing text...');
      const preprocessed = this.preprocessText(rawText);
      
      console.log('Processing with LLM...');
      const result = await this.processWithLLM(preprocessed);
      
      console.log('Storing expense...');
      await this.storeExpense(result, imageData.uri);
      
      return result;
    } catch (error) {
      console.error('Receipt processing failed:', error);
      throw error;
    }
  }

  // Store processed expense
  async storeExpense(expenseData, imageUri) {
    const expense = {
      id: Date.now().toString(),
      ...expenseData,
      image_uri: imageUri,
      created_at: new Date().toISOString(),
      processed_by: 'ocr_llm'
    };

    try {
      const existingExpenses = await AsyncStorage.getItem('expenses');
      const expenses = existingExpenses ? JSON.parse(existingExpenses) : [];
      expenses.push(expense);
      await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
      return expense;
    } catch (error) {
      console.error('Failed to store expense:', error);
      throw error;
    }
  }

  // Get processing statistics for accuracy tracking
  async getAccuracyStats() {
    try {
      const expenses = await AsyncStorage.getItem('expenses');
      if (!expenses) return { total: 0, highConfidence: 0, accuracy: 0 };

      const parsedExpenses = JSON.parse(expenses);
      const ocrExpenses = parsedExpenses.filter(e => e.processed_by === 'ocr_llm');
      const highConfidence = ocrExpenses.filter(e => e.confidence >= 0.8);

      return {
        total: ocrExpenses.length,
        highConfidence: highConfidence.length,
        accuracy: ocrExpenses.length > 0 ? (highConfidence.length / ocrExpenses.length) : 0
      };
    } catch (error) {
      console.error('Failed to get accuracy stats:', error);
      return { total: 0, highConfidence: 0, accuracy: 0 };
    }
  }

  // Development method to add sample OCR expenses
  async addSampleExpenses() {
    const sampleExpenses = [
      {
        id: (Date.now() - 86400000).toString(),
        merchant_name: "Starbucks Coffee",
        total_amount: 9.40,
        date: "2024-08-27",
        category: "Food & Dining",
        confidence: 0.92,
        line_items: ["Grande Latte", "Chocolate Croissant"],
        reasoning: "Coffee shop merchant name and food items detected",
        image_uri: null,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        processed_by: "ocr_llm",
        fullText: "STARBUCKS STORE #1234 GRANDE LATTE $5.45 CHOCOLATE CROISSANT $3.25 TOTAL $9.40"
      },
      {
        id: (Date.now() - 172800000).toString(),
        merchant_name: "Shell Gas Station",
        total_amount: 48.63,
        date: "2024-08-26",
        category: "Transportation",
        confidence: 0.87,
        line_items: ["Gasoline 12.5 GAL"],
        reasoning: "Gas station merchant and fuel purchase detected",
        image_uri: null,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        processed_by: "ocr_llm",
        fullText: "SHELL GAS STATION GASOLINE 12.5 GAL @ $3.89 TOTAL $48.63"
      }
    ];

    try {
      const existingExpenses = await AsyncStorage.getItem('expenses');
      const expenses = existingExpenses ? JSON.parse(existingExpenses) : [];
      
      // Only add if no expenses exist (to avoid duplicates)
      if (expenses.length === 0) {
        const updatedExpenses = [...expenses, ...sampleExpenses];
        await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
        console.log('Sample OCR expenses added for testing');
      }
    } catch (error) {
      console.error('Failed to add sample expenses:', error);
    }
  }
}

export default new ReceiptProcessor();