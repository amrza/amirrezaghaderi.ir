+++
title = "کالبد شکافی GraalVM"
date  = "2018-04-18"
jdate = "۱۳۹۷/۰۱/۲۹"
draft = false

postdesc = "کالبد شکافی VM جدیدی که اوراکل توسعه داده است"
postkeywords = "برنامه‌نویسی, جاوا, ماشین, ماشین مجازی, زبان, کامپایل"
topic = ["برنامه نویسی", "جاوا"]

+++

<a name="toc"></a>
## فهرست مطالب

- [ماشین چیست؟ (Machine)][machine]
- [ماشین مجازی چیست؟ (VM)][vm]
- [ماشین مجازی جاوا (JVM)][jvm]
- [GraalVm][graalvm]
- [Graal Compiler][graalcompiler]
- [Truffle][truffle]
- [SubstrateVM][substratevm]
- [ابزارهای جانبی][tools]
- [جمع بندی مطالب][conclusion]




در زمان نگارش این پست، هنوز ۲۴ ساعت نشده است که [شرکت Oracle از VM جدید خود با اسم GraalVM رونمایی کرده.](http://graalvm.org)
 و تعداد زیادی از برنامه‌نویسان مطمئن نیستند که GraalVM دقیقا چیست و چه کاری انجام می‌دهد. در این پست قصد داریم GraalVM را کالبدشکافی کنیم... 


بگذارید از صفر شروع نماییم!

<a name="machine"></a><a name="ماشین چیست؟ (Machine)"></a>
ماشین چیست؟ (Machine)
------------------------------------
در مطالب مربوط به برنامه‌نویسی، مفهوم «ماشین» (Machine) برابر با سیستمی است که قابلیت اجرای دستورات را داشته باشد. در هر دستگاه کامپیوتر، CPU قسمتی است که مسئول پردازش فرامین شماست؛ بنابراین در این سناریو، CPU برابر با «ماشین» است!

وقتی کدهای‌تان را در یک زبان برنامه‌نویسی نگارش می‌کنید، این کدها باید به نحوی روی CPU اجرا شوند. اما CPU چیزی به غیر از 0 و 1 (که توسط ولتاژ‌های الکتریکی بیان می‌شوند) را درک نمی‌کند. از همین رو CPU از نظر سخت افزاری به گونه‌ای طراحی می‌شود که «الگو» های مشخصی از 0 و 1 برایش دارای معنی شوند! فرضا اگر چهار 0 و چهار 1 پشت سر هم اتفاق افتاد، فلان عملیات را انجام بده!

این الگو‌ها برای CPU شرایطی را فراهم می‌آورند تا بتواند فرمان‌های مختلف را درک کند. به عبارتی این الگوها، تنها «زبان» ای هستند که CPU قادر به فهمیدن آن است. ما به این زبان، «زبان ماشین» می‌گوییم! (یا «کُدِ ماشین»)

زبان ماشین، برای تمام CPU ها یکسان نیست. یعنی همه‌ی CPU ها قادر به درک الگوهای یکسانی از 0 و 1 ها نیستند. کارخانه‌های مختلف، CPU های مختلفی تولید می‌کنند و هرکدام‌شان نیز الگوهای منحصر به فردی دارند. تفاوت در زبان ماشین (به همراه تعداد زیادی فاکتور دیگر)، معین کننده‌ی «معماری پردازشگر» است. فرضا معماری CPU لپ‌تاپ شما که توسط اینتل تولید شده است x86 می‌باشد، و معماری CPU های تولید شده توسط اپل که در آیفون شما به کار رفته‌اند ARM است.

<a name="vm"></a><a name="ماشین مجازی چیست؟ (VM)"></a>
ماشین مجازی چیست؟ (VM)
--------------------------------------
در بالاتر گفتیم که CPU ها معماری‌های مختلفی دارند و هر معماری دارای زبان ماشین منحصر به فرد خودش است.
اگر برنامه‌ای نوشته باشید و بخواهید آن را روی CPU های گوناگون اجرا کنید، باید به ازای هر معماری یک بار برنامه‌تان را از اول کامپایل کنید تا «کد ماشین» مخصوص آن معماری بدست آید.

اما موضوع فقط تفاوت در معماری‌های مختلف CPU نیست، باید این را هم در نظر بگیرید که برنامه شما قرار است روی یک «سیستم عامل» اجرا شود؛ سیستم عامل‌ها نیز هر کدام راه و روش خودشان را برای اجرای برنامه‌ها دارند و نمی‌توان برنامه‌ها را به شکلی یکسان روی تمام آن‌ها اجرا کرد. معماری CPU در کنار سیستم‌عامل، مفهومی به نام «سکو» یا «پلتفرم» را پدید می‌آورد.

تفاوت در پلتفرم‌های مختلف، توسعه‌ی برنامه‌ها را بسیار سخت خواهد کرد. برای این مشکل راه حل‌هایی وجود دارد:

- کامپایلر‌هایی داشته باشیم که بتوانند برای هر معماری و هر سیستم عامل، به طور جداگانه کد ماشین تولید کنند. مانند کاری که C و ++C انجام می‌دهند. این کار شدنی است، اما بسیار سخت است و باعث کند شدن روند توسعه‌ی زبان و ابزارهای پیرامون آن خواهد شد. ( تا اینکه LLVM آمد و دنیای برنامه‌نویسی را از این وضعیت نجات داد).

- از ماشین مجازی استفاده کنیم!

قضیه اینگونه است:

به جای اینکه مستقیما با ده‌ها معماری و سیستم‌عامل مختلف طرف شویم، «یک» محیط نرم‌افزاری یکسان طراحی می‌کنیم تا زبان برنامه‌نویسی ما از این به بعد فقط با این محیط مواجه شود. به این محیط نرم افزاری، «ماشین مجازی» می‌گوییم. بنابراین هنگام توسعه‌ی برنامه‌ی خود، دیگر لازم نیست نگران تفاوت‌هایی که بین پلتفرم‌های مختلف وجود دارد باشید. تنها کافیست که کدهای خود را برای این «ماشین مجازی» توسعه دهید.

در پشت صحنه، ماشین مجازی توسط زبان‌هایی مانند C و ++C توسعه داده شده است تا بتواند برای معماری‌ها و سیستم‌عامل‌های مختلف کد ماشین تولید کند. ماشین مجازی خودش یک برنامه‌ی نرم‌افزاری به حساب می‌آید و لازم است با پلتفرم‌های مختلف هماهنگ شود. اما هماهنگ کردن «یک» برنامه با «ده‌ها» پلتفرم، بهتر از هماهنگ کردن «میلیون‌ها» برنامه با «ده‌ها» پلتفرم است!

ماشین مجازی با اینکه از نظر منطقی یک مفهوم منفرد است، اما در واقع ممکن است از تعداد زیادی ابزار و تکنولوژی مختلف تشکیل شده باشد.

<a name="jvm"></a><a name="ماشین مجازی جاوا (JVM)"></a>
ماشین مجازی جاوا (JVM)
---------------------------------
مجموعه ابزارها و تکنولوژی‌هایی است که کنار یکدیگر قرار گرفته‌اند تا یک ماشین مجازی با توانایی اجرای برنامه‌های Java را ارائه کنند. JVM در طی سال‌ها پیشرفت کرده و بهینه‌سازی‌های زیادی رو آن انجام شده. همانطور که گفتیم، JVM از بخش‌های گوناگونی تشکیل شده؛ موتور پردازشی برنامه‌ها در JVM ، با نام HotSpot شناخته می‌شود.

از مهم‌ترین قابلیت‌هایی که در HotSpot وجود دارد، کامپایلر JIT است. هنگامی که برنامه‌ی شما روی HotSpot در حال اجرا است، در همان حال نیز یک فرآیند جانبی در حال مانیتور کردن و آنالیز کردن نحوه‌ی اجرای برنامه‌ی شماست. این فرآیند می‌تواند نقاط پراستفاده‌ی برنامه‌ی شما را شناسایی کند، و کدهای آن قسمت را در همان حین اجرا به زبان ماشین ترجمه نماید. یکی از دلایلی که جاوا سرعت به مراتب بالاتری به نسبت زبان‌های دیگر دارد وجود همین قابلیت است.

به کامپایلر‌هایی مانند JIT که کدهای شما را در حین اجرا (و به عبارتی روی هوا) کامپایل می‌کنند، «کامپایلر داینامیک» می‌گوییم (هیچ ربطی به مبحث تایپ سیستم‌ها ندارد).

امروزه علاوه بر زبان جاوا، زبان‌های دیگری مانند کلوژور و اسکالا و کاتلین و ... نیز روی JVM اجرا می‌شوند. و مشکل دقیقا همینجاست!

در آن سال‌های دور که JVM ساخته شد، مشخصا برای زبان جاوا طراحی شده بود. و هنوز هم می‌توان گفت تنها زبانی که برای JVM اهمیت دارد جاوا است. بقیه زبان‌هایی که دوست دارند تحت JVM اجرا شوند، مجبورند با این قضیه بسازند و بسوزند.

این در حالی است که به گفته جیمز گاسلینگ (خالق زبان جاوا)، این در واقع JVM بوده که در مرکز توجهات قرار داشته و «زبان جاوا» موضوع اصلی نبوده! هدف نهایی و بزرگ‌تر آن‌ها این بود که یک VM مناسب برای ساخت برنامه‌ها طراحی کنند؛ اما در عمل اینطور نشد و JVM به ماشینی تبدیل شد که مشخصا برای اهداف یک زبان خاص به اسم جاوا فعالیت می‌کند.

هر روز زبان‌های بیشتری برای اجرا شدن روی JVM علاقه نشان می‌دهند. و هزینه‌های زیادی نیز برای JVM انجام می‌شود تا این سیستم بتواند هر روز بهینه تر از دیروز باشد. اما این همه زحمت و تلاش و هزینه به هدر می‌رود اگر قرار باشد فقط برای یک زبان بخصوص خرج شود.

جدای از این‌ها، JVM در حال حاضر یک محصول نرم‌افزاری مُسن به حساب می‌آید. توسعه‌ی بخش‌های مختلف آن دیگر آنقدر راحت و سریع اتفاق نمی‌افتد و نمی‌تواند با زبان‌های مدرن امروزی همپا شود. شاید اگر قرار باشد امروز JVM را از صفر طراحی کنند، تصمیمات زیادی را به گونه‌ی دیگری می‌گرفتند...

همه‌ی این‌ها باعث شد تا اوراکل از چندین سال پیش تحقیقات روی پروژه‌ای را در آزمایشگاه‌های خود استارت بزند تا بتواند VM ای بسازد که:

- از JVM بهینه تر باشد. هم از نظر سرعت اجرا، و هم از نظر مصرف منابع (مثل رم).
- طراحی آن ماژولارتر باشد تا بتوان براحتی آن را توسعه داد و همگام با تحولات روز برنامه‌نویسی پیش رفت.
- به هیچ زبانی وابسته نباشد تا بتواند تعداد زیادی از زبان‌های مختلف را پشتیبانی کند.

و حاصل این چند سال تحقیق و توسعه، امروز به طور stable با نام GraalVM منتشر شد!


<a name="graalvm"></a>
GraalVm
----------------
GraalVM هم یک نرم افزار منفرد نیست. مجموعه‌ای از ابزارها و تکنولوژی‌هایی است که کنار یکدیگر قرار گرفته‌اند تا یک ماشین مجازیِ مستقل از زبان ارائه دهند؛ با این هدف که بتوان از این VM برای اجرای تعداد زیادی از زبان‌های برنامه‌نویسی استفاده کرد و همچنین بتوان میان کدهایی که در این زبان‌ها می‌نویسید براحتی ارتباط برقرار نمود. به زبان ساده: One VM to rule them all

GraalVM هم می‌تواند به صورت مستقل اجرا شود، و هم تحت JVM یا Node اجرا شود.

GraalVM از بخش‌های اصلی زیر تشکیل شده است:


<a name="graalcompiler"></a>
Graal Compiler
-------------------------
وقتی Java9 منتشر شد، همه توجه شان به سیستم ماژول با نام Jigsaw یا ترمینال جدید JShell منعطف شد. ولی مهم‌ترین قابلیتی که در این نسخه وجود داشت از چشم همه پنهان ماند: JVMCI

JVMCI که مختصر شده‌ی عبارت Java based JVM Compiler Interface است، قابلیت جدیدی در Java9 است که امکان ساخت یک «کامپایلر داینامیک» در زبان جاوا را مهیا می‌سازد، با این هدف که بتوان برای JVM کامپایلرهای JIT اختصاصی و کاستوم شده طراحی کرد!

کامپایلر JIT فعلی که در JVM وجود دارد با نام C2 شناخته می‌شود. C2 همان چیزی است که جاوا بخش زیادی از سرعت خود را مدیون آن است. اما این کامپایلر چند اشکال اساسی دارد:

- در ++C ساخته شده. ++C زبان راحتی نیست. نوشتن برنامه‌های «ایمن» با این زبان و در چنین ابعاد بزرگ و حساسی، بسیار سخت است. هر کجا از C2 را که دست می‌زدند، باگ دیگری از جای دیگر ظاهر می‌شد. ( تصور کنید که موزیلا برای حل مشکلات فایرفاکس و فرار از ++C، کلا یک زبان دیگر به اسم Rust را از صفر طراحی کرد! و اپل و گوگل نیز همینطور... تا این حد اوضاع خراب است!)

- معماری کدهای C2 در حال حاضر بسیار متزلزل است و توسعه‌ی آن نه تنها کار راحتی نیست، بلکه کار هر کسی هم نیست! افراد زیادی وجود ندارند که بتوانند براحتی کدهای آن را بفهمند!

- C2 مشخصا برای بهینه سازی Bytecode ها طراحی شده. Bytecode هایی که خودشان هم انحصارا برای زبان جاوا طراحی شده بودند.

اما حالا به کمک JVMCI  این قابلیت را دارید تا:

- کامپایلر JIT را در یک زبان راحت‌تر مانند جاوا توسعه دهید.
- خودتان از اول یک کامپایلر با معماری بهتر و ماژولارتر طراحی کنید تا توسعه‌ی آن راحت باشد.
- بتوانید این کامپایلر JIT جدید را با C2 جایگزین کنید تا JVM بتواند از آن بهره برداری کند.
- و حالا که دارید یک کامپایلر JIT جدید می‌سازید، لازم نیست فقط زبان جاوا را هدف قرار دهید. دست شما باز است تا به زبان‌های دیگر هم توجه کنید.

و این شد که Graal Compiler به عنوان یک آلترنایو جدید برای C2 ساخته شد. حالا می‌توانید به جای JIT پیشفرض موجود در JVM، از Graal استفاده کنید. Graal چند خصوصیت اصلی دارد:

- در زبان جاوا توسعه داده شده.
- هوشمند‌تر از C2 است و کدهای سریع‌تری تولید می‌کند.
- کدهایی که تولید می‌کند از نظر مصرف منابع سیستم بهینه‌تر هستند.
- هیچ چیزی تحت مفهوم «زبان برنامه‌نویسی» ندارد!

این مورد آخر ممکن است توجه شما را جلب کرده باشد. درست خواندید:

<span class="in-red">
« Graal چیزی تحت عنوان زبان برنامه نویسی ندارد. کاری ندارد که زبان شما جاوا است یا کاتلین یا پایتون یا هر چیز دیگر. با bytecode ها هم کاری ندارد و نمی تواند آن ها را درک کند! بلکه Graal مستقیما روی AST فعالیت می‌کند!»
</span>

کدهایی که شما می‌نویسید حالت متنی دارند. قبل از اینکه زبان برنامه‌نویسی بتواند با این کدها کاری انجام دهد، ابتدا باید آن‌ها را «درک» کند. یعنی باید آن‌ها را Parse کند. وقتی که یک Parser کدهای شما را Parse می‌کند، اطلاعات موجود در کدهای شما را در یک ساختار داده‌ای درختی شکل، روی حافظه قرار می دهد تا کامپایلر بتواند از آن استفاده کند. این ساختار درختی شکل AST نام دارد. به عبارتی کدهای متنی چیزهایی هستند که شما به عنوان یک انسان می‌بینید، و ساختار AST چیزی است که کامپایلر قادر به دیدن آن است.

قبلا برای اجرای برنامه‌های شما در JVM این مراحل طی می‌شد:

- کدهای‌تان را بنویسید.
- parser کدهای شما را به AST تبدیل کند.
- کامپایلر AST را بهینه سازی کند و پس از بهینه سازی، bytecode تولید نماید.
- HotSpot شروع به اجرای bytecode ها نماید.
- C2 در حین اجرای برنامه، bytecode را به کد ماشین تبدیل کند.

حالا با Graal وضعیت اینطوری است:

- کدهای‌تان را بنویسید.
- parser کدهای شما را به AST های بهینه تبدیل کند.
- Graal در حین اجرای برنامه، AST را مستقیما به کد ماشین تبدیل کند.

خوب تا اینجای کار، متوجه شدیم که JVM یک کامپایلر JIT جدید به نام Graal دارد و زبان‌هایی مثل جاوا و اسکالا و کاتلین و غیره از همین امروز می‌توانند از امکانات و بهینه‌سازی های آن استفاده کنند. حتی تویتر، همین الآن نیز در حال استفاده از Graal برای کدهای اسکالا است!


<a name="truffle"></a>
Truffle
-------------
برای ساخت یک برنامه وب، شما از فریم‌ورک‌هایی مانند Django یا Laravel یا Rails یا... استفاده می‌کنید. دلیل این کار چیست؟ این فریم‌ورک‌ها خیلی از ابزارها و کدهایی که برای ساخت یک برنامه‌ی وب نیاز است را از قبل آماده کرده‌اند تا کار ما راحت‌تر و سریع‌تر انجام شود. علاوه بر آن، برنامه‌های شما نیز حالت یونیفرم تری به خود می‌گیرند. مثلا تمام برنامه‌هایی که با Laravel نوشته می‌شوند، با API یکسانی به دیتابیس متصل می‌شوند.

حالا فرض کنید به همین حالت که می‌توانید یک برنامه‌ی وب را به کمک وب‌فریم‌ورم‌ها بسازید، فریم‌ورکی هم وجود داشت که بتوانید به کمک آن یک زبان‌برنامه نویسی بسازید!

Truffle فریم‌ورکی است به زبان جاوا که به کمک آن، شما قادر هستید برای خودتان یک زبان برنامه نویسی بسازید. و اگر زبان برنامه‌نویسی خود را بر مبنای Truffle بسازید، قادر خواهید بود از روی کدهای‌تان ASTهایی دریافت کنید که قابل کامپایل با Graal باشند! تازه موضوع جالب شد!

در بخش قبل گفتیم که Graal به زبان اهمیت نمید‌هد و فقط AST برایش مهم است. AST هایی که Graal می‌تواند آن‌ها را کامپایل کند توسط Truffle تولید می‌شوند. بنابراین اگر با کمک Truffle یک مفسر برای پایتون، روبی، یا جاوااسکریپت بسازید، تمام آن‌ها می‌توانند به خورد Graal داده شوند و قابلیت اجرا شدن روی سیستم جدید JVM را داشته باشند.

و خبر خوش اینکه، مفسر این زبان‌ها از قبل توسط تیم اوراکل با Truffle ساخته شده‌اند:

- زبان‌های نرمال JVM مانند جاوا، اسکالا، کاتلین... از طرف اوراکل. هماهنگی ۱۰۰٪ با کدهای نرمال این زبان‌ها.
- JavaScript ، از طرف اوراکل. هماهنگی ۱۰۰٪ با کدهای نرمال جاوا اسکریپت
- Ruby ، از طرف اوراکل. هماهنگی ۱۰۰٪ با کدهای نرمال روبی (هنوز حالت بتا دارد)
- Python ، از طرف دانشگاه ایرواین (UC Irvine) هنوز تکمیل نشده.
- R ، از طرف اوراکل. هنوز کامل نیست ولی قابل استفاده است.
- Sulong ، از طرف اوراکل. این یک مفسر برای Bitcode های (زبان میانی) LLVM است و می‌تواند هر زبانی که مبتنی بر LLVM است را ساپورت کند (مثل C و C++ و Swift و Rust و...).

قبل از Truffle و Graal اگر می خواستید یک زبان برنامه‌نویسی بسازید، اوضاع اینچنین بود:

- مقدمات ساخت یک زبان را توسعه دهید: parser و ...
- از صفر برای زبان‌تان یک VM توسعه دهید: مفسر، runtime ، gc ، ...
- بعد از اینکه زبان پایدار شد، تازه شروع می‌کردید که VM را در گذر زمان بهینه سازی کنید: کامپایلر JIT، بهینه سازی GC ، ...
- کلی زمان می‌برد که کامیونیتی برای زبان شما کتابخانه‌ها و فریم‌ورک‌های گوناگون بنویسد...

اما حالا با وجود Truffle و Graal اوضاع اینگونه است:

- مقدمات ساخت یک زبان را توسعه دهید: parser و ...
- و.... تمام.... بقیه چیزها برای شما آماده است!

تنها کاری که شما باید بکنید، این است که مفسر زبان‌تان را با Truffle توسعه دهید تا بتوانید برای Graal ساختار AST تولید کنید. Truffle یک فریم‌ورک جاوا است و شما زبان‌تان را با جاوا توسعه خواهید داد و لازم نیست با C یا C++ که زبان‌های سختی هستند درگیر شوید.

هر زبانی که مفسر آن توسط Truffle ساخته شود و بتواند قابل کامپایل با Graal باشد، می‌تواند با زبان‌های دیگری که به این روش تولید شده‌اند ارتباط مستقیم داشته باشند. ساختار‌های داده‌ای، کلاس‌ها، متدها، ... همه‌ی این‌ها با پروتکل‌هایی که در GraalVM قرار داده شده است قابل اشتراک خواهند بود. فرضا می‌توانید براحتی فلان کتابخانه از جاوا را در کدهای روبی صدا بزنید (و برعکس).

<span class="in-red">
می‌توان اینطور گفت که GraalVM همان کاری را برای زبان‌های VM دار انجام می‌دهد، که پروژه LLVM برای زبان‌های Native انجام می‌دهد!
</span>


<a name="substratevm"></a>
SubstrateVM
----------------------

کامپایلر Graal علاوه بر اینکه می تواند به عنوان یک کامپایلر JIT فعالیت کند، قابلیت کامپایل کدها به صورت AOT را نیز دارد. در مجموعه‌ی نرم افزاری GraalVM ابزاری به نام native-image وجود دارد که می‌تواند از کامپایلر Graal برای ساخت بسته‌ها/ایمیج‌های Native استفاده کند. 

مجموعه‌ی GraalVM یک VM سبک‌تر (به نسبت JVM) ارائه کرده است که با نام SubstrateVM ارا‌یه می‌شود. SubstrateVM مسئول اجرای ایمیج‌های Native است، به این معنی که امکاناتی نظیر runtime یا gc که مورد نیاز زبان‌های مختلف می‌باشند را فراهم می‌کند. SubstrateVM به ایمیج نهایی الحاق خواهد شد.

بدین ترتیب جاوا یا زبان های دیگری که روی Graal فعال خواهند بود، علاوه بر اینکه می‌توانند روی JVM اجرا شوند، خواهند توانست به طور Native و بدون نیاز به VM نیز اجرا شوند. البته وقتی می‌گوییم به طور Native اجرا می‌شوند، انتظار چیزی در حد و اندازه ++C/C یا Go یا Swift یا Rust را نداشته باشید. این AOT چیزی شبیه ART در اندروید است:

- سیستم runtime و gc در ایمیج وجود دارند و جایی نرفته اند. این امکانات توسط SubstrateVM ارايه شده‌اند.
- امکانات SubstrateVM در ایمیج نهایی الحاق خواهد شد و شما در نهایت «یک» فایل اجرایی «مستقل» تحویل خواهید گرفت.
- ایمیج‌های Native ای که به این صورت ساخته می‌شوند، دیگر نیاز به وجود JVM ندارند. می‌توانید براحتی آن‌ها را روی کامپیوترهای دیگر کپی کنید و اجرا نمایید.
- ایمیج‌هایی Native دارای حجم بالایی نیستند و برای ساخت ابزارهای کوچک مناسب می‌باشند.
- استارتاپ برنامه‌ها با ایمیج‌هایی Native، چندین برابر (حتی گاهی بیشتر از ده برابر) سریعتر از استارتاپ JVM خواهد بود.
- مصرف حافظه با ایمیج‌هایی Native، بسیار پایین‌تر از JVM خواهد بود.
- ایمیج‌هایی Native به طور پیش‌فرض دارای JIT نخواهند شد، بنابراین ممکن است سرعتی پایین‌تر از JVM داشته باشید. (فقط ممکن است، در تمام شرایط اینطور نیست).
- می‌توانید درخواست کنید که JIT نیز به  ایمیج نهایی اضافه شود تا از بهینه‌سازی‌هایش بهره‌مند شوید (ولی به همان نسبت سرعت استارتاپ و مصرف حافظه بالاتر خواهد رفت. بنابراین باید چنین تصمیمی را با توجه به نیازتان بگیرید).
- برنامه‌های Native شما می‌توانند به دیگر کدهای Native لینک شوند.
- [همچنین SubstrateVM دارای محدودیت‌هایی نیز هست که باید حتما به آن توجه کنید.](https://github.com/oracle/graal/blob/master/substratevm/LIMITATIONS.md)

فرضا می‌توانید برنامه‌های سرور را با JVM اجرا کنید، ولی برای برنامه‌های ترمینال یا GUI ایمیج‌های Native تهیه کنید تا سبک‌تر باشند.


<a name="tools"></a><a name="ابزارهای جانبی"></a>
ابزارهای جانبی
---------------------
شرایطی که GraalVM مهیا کرده است باعث شده که بتواند ابزارهای جانبی مانند Profiler یا Debugger را هم به طور مشترک برای تمام زبان‌های Truffle قابل استفاده کند. این قضیه طراحان زبان را از دوباره کاری برای ساخت چنین ابزارهایی راحت می‌کند.


<a name="conclusion"></a><a name="جمع بندی مطالب"></a>
جمع بندی مطالب
-----------------------------------------

- GraalVM یک سیستم منفرد نیست، بلکه چتری از سیستم‌های گوناگون است.
- GraalVM دارای یک فریم‌ورک به نام Truffle برای ساخت زبان‌های برنامه‌نویسی است.
-  GraalVM دارای یک کامپایلر جدید به نام Graal است که در زبان جاوا نوشته شده و قابلیت کامپایل کردن تمام زبان‌هایی که با Truffle ساخته شده است را دارد.
- GraalVM می‌تواند از کامپایلر Graal، هم به عنوان کامپایلر JIT استفاده کند و هم به عنوان کامپایلر AOT.
- کامپایلر Graal از کامپایلر JIT پیش‌فرضی که در JVM وجود دارد و با نام C2 شناخته می‌شود، باهوش‌تر است و کدهای بهینه‌تری تولید می‌کند.
- GraalVM می‌تواند کامپایلر Graal را جایگزین کامپایلر JIT پیش‌فرضی که در حال حاضر در JVM وجود دارد نماید (کامپایلر C2).
- GraalVM می‌تواند از کامپایلر Graal به عنوان کامپایلر AOT نیز استفاده نماید و به کمک ابزار native-image ، ایمیج‌های مستقل و Native تولید کند.
- GraalVM دارای یک VM سبک به نام SubstrateVM است که به نوعی مسئول ارائه‌ی تدراکات برای ایمیج‌های Native است.
- GraalVM به طور پیش‌فرض، روی JVM اجرا خواهد شد و  از تمام امکانات JVM مانند runtime یا gc های موجود در آن بهره‌مند خواهد شد. با این تفاوت، که قسمت‌هایی از JVM را برای بهره‌وری بیشتر با سیستم‌هایی که خودش توسعه داده جایگزین می‌کند.
- به همان صورتی که در مورد بالا گفته شد، GraalVM می‌تواند روی ماشین Node نیز اجرا شود (V8).
- GraalVM تعدادی زبان برنامه‌نویسی را در همین اول کار برای شما مهیا کرده است. بقیه زبان‌ها به مرور زمان می‌توانند توسط Truffle ساخته شوند.
- تمام زبان‌هایی که به این صورت توسعه پیدا کنند، می‌توانند به طور مستقیم با یکدیگر در ارتباط باشند.
- GraalVM در حال حاضر Stable به حساب می‌آید و تویتر از GraalVM استفاده می‌کند.
- چون GraalVM تازه عمومی شده، هنوز شک و شبهه‌هایی درباره موضوع مجوز‌های آن وجود دارد. ممکن است فقط برای توسعه‌ی آزاد بتوانید از آن استفاده کنید و برای برنامه‌های تجاری قابل استفاده نباشد، مگر اینکه لیسانس آن تهیه شود (https://github.com/oracle/graal/issues/269)


[machine]: #machine
[vm]: #vm
[jvm]: #jvm
[graalvm]: #graalvm
[graalcompiler]: #graalcompiler
[truffle]: #truffle
[substratevm]: #substratevm
[tools]: #tools
[conclusion]: #conclusion


