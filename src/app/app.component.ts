import { environment } from './../environments/environment.development';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import {
  GenerateContentRequest,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { FileConversionServiceService } from './file-conversion-service.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'gemini-app';
  fileConvService = inject(FileConversionServiceService);
  ngOnInit() {
    // this.TestGeminiPro();
    // this.TestGeminiProvisionImages();
    this.TestGeminiChat();
  }
  async TestGeminiPro() {
    //Initialize the model with your API key
    const genAi = new GoogleGenerativeAI(environment.API_KEY);
    // Setting up model parameters for generation with safety settings and max output tokens limit
    const generationConfig = {
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
      maxOutputTokens: 100,
    };
    // Choosing a gemini model
    const model = genAi.getGenerativeModel({
      model: 'gemini-pro',
      ...generationConfig,
    });

    // Make a prompt for the model
    const prompt = 'Make a peom of The angular Framework';

    //generate the content with the prompt
    const result = await model.generateContent(prompt);
    const response = result.response;
    // console.log(response.candidates?.[0].content.parts[0].text);
    console.log(response.text());
  }

  // Generate text from text-and-images imput
  async TestGeminiProvisionImages() {
    try {
      let imageBased64 = await this.fileConvService.convertToBase64(
        './assets/Dog2.jpg'
      );

      if (typeof imageBased64 !== 'string') {
        console.error('image conversion to base64 failed');
        return;
      }
      //Initialize the model with your API key
      const genAi = new GoogleGenerativeAI(environment.API_KEY);
      // Setting up model parameters for generation with safety settings and max output tokens limit
      const generationConfig = {
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
        maxOutputTokens: 100,
      };
      // Choosing a gemini model
      const model = genAi.getGenerativeModel({
        model: 'gemini-pro',
        ...generationConfig,
      });
      //model initialization missing for brevity
      let prompt = [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBased64,
          },
        },
        {
          text: 'Describethe the image',
        },
      ];
      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log(response.text());
    } catch (error) {
      console.error('Error converting the image to base64', error);
    }
  }

  //Multi-turn conversion chat

  async TestGeminiChat() {
    //Initialize the model with your API key
    const genAi = new GoogleGenerativeAI(environment.API_KEY);
    // Setting up model parameters for generation with safety settings and max output tokens limit
    const generationConfig = {
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
      temperature: 0.9,
      top_p: 1,
      top_k: 32,
      maxOutputTokens: 100,
    };
    // Choosing a gemini model
    const model = genAi.getGenerativeModel({
      model: 'gemini-pro',
      ...generationConfig,
    });

    //Model initilization missing for brevity
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [
            {
              text: 'Hello , I am David , your AI assitant in angular . Please ask questions about angular and i wll be happy to assist you !',
            },
          ],
        },
        {
          role: 'model',
          parts: [
            {
              text: '**Questions about Angular**\n\n**Architecture:**\n* What is the fundamental architecture of Angular?\n* How does Angular implement the Model-View-Controller (MVC) pattern?\n* What is dependency injection in Angular and how is it used?\n\n**Components and Modules:**\n* What are components in Angular and what is their purpose?\n* How do modules organize and encapsulate Angular applications?\n* What is the difference between declarations, providers, and imports in Angular modules?\n\n**Data Binding:**\n* How does Angular implement data binding?\n* What are the different types of data binding in Angular?\n* How can I use data binding to create dynamic user interfaces?\n\n**Routing:**\n* How does Angular handle routing between different components?\n* What is the role of the RouterModule and Routes in Angular routing?\n* How can I create nested and lazy-loaded routes?\n\n**State Management:**\n* What are the different state management techniques used in Angular?\n* How do services and NgRx store manage state in Angular applications?\n* What are the advantages and disadvantages of different state management approaches?\n\n**Forms:**\n* How does Angular handle form validation and data submission?\n* What are the different types of form controls in Angular?\n* How can I create custom form validators?\n\n**Testing:**\n* What are the best practices for testing Angular applications?\n* How can I write unit tests and integration tests using Jasmine and Karma?\n* What is end-to-end testing and how can I implement it in Angular?\n\n**Performance:**\n* What are the common performance issues in Angular applications?\n* How can I optimize component rendering and detect performance bottlenecks?\n* What tools are available for monitoring Angular application performance?\n\n**Deployment:**\n* How do I deploy Angular applications to production?\n* What are the different hosting options available for Angular applications?\n* How can I optimize Angular applications for search engine optimization (SEO)?',
            },
          ],
        },
        {
          role: 'user',
          parts: [{ text: 'Hello' }],
        },
        {
          role: 'model',
          parts: [
            {
              text: "Hello there! I am David, your AI assistant for Angular. Feel free to ask me any questions you have about Angular, and I'll be happy to help you out.\n\nHere are some examples of questions you can ask me:\n\n* How do I create a new Angular project?\n* What is the difference between components and directives?\n* How can I use Angular to fetch data from an API?\n* What are the best practices for writing Angular code?\n* How can I debug an Angular application?\n\nI'm still under development, but I'm learning more about Angular every day. So don't hesitate to ask me any questions you have, and I'll do my best to answer them.",
            },
          ],
        },
      ],
    });
    // const prompt = {
    //   contents: [
    //     {
    //       role: 'user',
    //       parts: [
    //         {
    //           text: 'Hello',
    //         },
    //       ],
    //     },
    //   ],
    // };
    // const streamingResp = await model.generateContentStream(prompt);

    // for await (const item of streamingResp.stream) {
    //   console.log(item.text());
    // }
    // console.log('Agragated response :' + (await streamingResp.response).text());
    const prompt = 'Hello , What is the largest country in the world?';
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    console.log(response.text());
  }
}
