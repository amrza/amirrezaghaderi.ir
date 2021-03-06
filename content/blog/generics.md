+++
title = "شیوه‌های مختلف پیاده سازی جنریک در زبان‌ها"
date  = "2017-07-11"
jdate = "۱۳۹۶/۰۴/۲۰"
draft = false

postdesc = "نگاهی به شیوه‌های مختلف پیاده سازی جنریک در زبان های برنامه نویسی"
postkeywords = "جنریک, تایپ, برنامه نویسی, برنامه‌نویسی"
topic = ["برنامه نویسی", "تایپ سیستم"]

+++

<a name="toc"></a>
## فهرست مطالب

- [مطالب پیش‌نیاز][prereq]
- [شیوه‌های مختلف پیاده سازی جنریک در زبان‌ها][generic-howto]
- [بسته‌بندی و بسته‌گُشایی در زمان اجرا (Boxing and Unboxing)][boxing-unboxing]
- [تولید کد (Code generation)][code-generation]
- [یک ریخت سازی ( Monomorphization )][monomorphization]
- [پاک‌سازیِ تایپ (Type Erasure)][type-erasure]


<a name="prereq"></a>
**مطالب پیش نیاز**

در این نوشته قصد داریم شیوه‌هایی که زبان‌های مختلف برنامه‌نویسی به کمک آن جنریک‌ها را  در خود پیاده سازی کرده‌اند بررسی کنیم. قبل از خواندن این نوشته، نیازمند آشنایی با یک سری مفاهیم پیش نیاز هستید. مثلا، این «جنریک» که قرار است درباره پیاده سازی آن صحبت کنیم اصلا چه چیزیست؟ اگر با چنین مباحثی آشنا نیستید، می‌توانید برای مطالعه‌ی آن‌ها به زبان فارسی وارد لینک‌های زیر شوید:

- [پُلی مورفیسم - چندریختی (Polymorphism)][polymorphism]
- [کامپوزیشن چیست؟][composition]
- [اینترفیس (Interface)][interface]
- [تایپ سیستم مبتنی بر ساختار (Structural type system)][structural-type-system]
- [داک تایپینگ (Duck typing)][duck-typing]
- [جنریک (Generic)][generic]



<a name="generic-howto"></a>
## شیوه‌های مختلف پیاده سازی جنریک در زبان‌ها
برای پیاده‌سازی جنریک در زبان‌های برنامه‌نویسی، شیوه‌های گوناگونی ابداع شده است؛ اما می‌توان تمام آن‌ها را به شکل مستقیم یا غیر مستقیم در دو گروه زیر طبقه بندی کرد:

- بسته‌بندی و بسته‌گُشایی در زمان اجرا (Boxing and Unboxing)
- تولید کد (Code generation)

بیایید کمی این دو را توضیح دهیم...

<a name="boxing-unboxing"></a>
### بسته‌بندی و بسته‌گُشایی در زمان اجرا (Boxing and Unboxing)
یک انبار لوازم خانگی را تصور کنید: کولر، یخچال، تلویزیون، سینما خانگی، چرخ گوشت، آب میوه گیری،...

وقتی وارد این انبار شوید چه می‌بینید؟ کولر و یخچال و تلویزیون و ..؟ خیر، شما در این انبار فقط «جعبه» می‌بینید! جعبه‌های بزرگ و کوچک که در کنار هم چیده شده اند. تمام آن لوازم، در این جعبه‌ها قرار دارند. به عبارتی «جعبه»، یک موجودیت استاندارد است که می‌توانیم هر نوع وسیله‌ای که بخواهیم درآن قرار دهیم. مهم نیست جنس وسیله چه باشد، تمام آن‌ها می‌توانند در جعبه‌ها «بسته‌بندی» شوند! با بسته‌بندی کردن وسایل در جعبه‌ها، ما شکل و شمایل همه‌ی آن‌ها را «یکسان» کرده‌ایم.

اگر می‌خواستیم مثال بالا را در برنامه‌نویسی عنوان کنیم چنین می‌شد:

چند تایپ داریم: تایپِ کولر، تایپِ یخچال، تایپِ تلویزیون،... این تایپ‌ها با یکدیگر متفاوت هستند، اما می‌توانیم آن‌ها در «تایپِ جعبه» بسته‌بندی کنیم؛ با اینکار تایپ تمام آن‌ها از نمای بیرون، یکسان خواهد بود. حالا می توانیم از این یکسان شدن تایپ‌ها برای پلی مورفیسم استفاده نماییم.

تایپِ جعبه در زبان‌های برنامه‌نویسی معمولا توسط یک اشاره‌گر پیاده‌سازی می‌شود. یعنی به جای اینکه مستقیم با تایپِ مد نظرمان طرف شویم، با یک تایپ ثانویه که شامل اشاره‌گری به تایپ مورد نظرمان است طرف خواهیم شد. 

برگردیم به مثال انبار لوازم خانگی؛ فرض کنید می‌خواهید از یکی از تلویزیون‌های داخل انبار استفاده کنید. اما تلویزیون درون جعبه است، آیا می‌توانید جعبه‌ی تلویزیون را مستقیم به برق وسط کنید؟ خیر... باید ابتدا جعبه را «بسته‌گشایی» نمایید تا بدین ترتیب به محتوای درون آن که همان تلویزیون باشد دسترسی پیدا کنید.

در برنامه‌نویسی هم همینطور است. اگر تایپی را توسط «تایپِ جعبه» بسته‌بندی کرده باشید، دیگر نمی‌توانید مستقیما با آن تایپ کار کنید. باید ابتدا «تایپِ جعبه» را بسته‌گشایی کنید تا بتوانید به چیزی که درون آن است دسترسی پیدا کنید. همانطور که گفتیم «تایپ جعبه» شامل اشاره‌گریست به تایپ اصلی؛ ما برای دسترسی به تایپ اصلی باید به شکل غیر مستقیم و از طریق این اشاره‌گر، به مکان آن تایپ در حافظه رجوع کنیم. (dereference)

مثلا وقتی در پایتون می‌گویید a = 10 ، عدد صحیح 10 در متغیر a ریخته **نمی‌شود**.  a در واقع یک اشاره‌گر است که به مکان دیگری از حافظه که عدد صحیح 10 در آن حضور دارد اشاره می کند. در این حالت می‌گوییم آن مقدار را به کمک a بسته‌بندی کرده‌ایم.

 چون مقدار 10 توسط a بسته‌بندی شده است، نمی‌توانیم مستقیم به آن دسترسی داشته باشیم. در صورتی که بخواهیم از مقدار درون متغیر a استفاده کنیم، باید به طور غیر مستقیم و به کمک ارجاعی که a در اختیار ما گذاشته است به آن برسیم. در این حالت می‌گوییم دسترسی به مقدار 10 از طریق بسته‌گشایی از متغیر a رخ داده است.

```
+-------+                     +--------+
|   a   | ----------------->  |   int  |
+-------+                     +--------+
                              |   10   |
                              +--------+
```
قریب به اتفاق زبان‌های داینامیک‌تایپ از این تکنیک استفاده می‌کنند؛ مانند پایتون، روبی، پی‌اچ‌پی، جاوااسکریپت و غیره... تمام اعمال مربوط به بسته‌بندی‌ها و بسته‌گشایی ها در پشت صحنه و به دور از چشمان شما انجام می‌گیرد و شما به حالت معمول لازم نیست کاری انجام دهید؛ برای همین است که شما در این زبان‌ها نیاز به جنریک ندارید، چرا که این زبان‌ها به طور خودکار دارای جنریک در زمان اجرا هستند.

زبان‌های استاتیک هم می‌توانند از تکنیک «بسته‌بندی و بسته‌گُشایی» استفاده نمایند تا جنریک‌ها را در زمان اجرا پیاده‌سازی کنند.

مزیت‌های این تکنیک:

- سادگی در پیاده سازی
- انعطاف پذیری بسیار بالا (در حدی که کدهای‌تان عملا تبدیل به کدهای داینامیک می‌شوند!)

معایب این تکنیک:

- مصرف حافظه بالاتر (به دلیل بسته بندی تایپ‌ها با یک لایه‌ی ثانویه)
- سرعت اجرای پایین‌تر (به دلیل اعمال مربوط به بسته‌بندی و بسته‌گُشایی)
- امنیت پایین‌تر به دلیل اتفاق افتادن این مکانیزم در زمان ران‌تایم (کامپایلر نمی‌تواند تایپ‌ها را قبل از اجرای برنامه چک کند، چرا که تمام تایپ‌ها از نظر او از یک جنس هستند: تایپِ جعبه)

<a name="code-generation"></a>
### تولید کد (Code generation)
تولید کد یا ویرایش آ‌ن‌ها قبل از مرحله‌ی نهایی کامپایل، از وظایف بدیهی هر کامپایلر است. کامپایلرها یا ابزارهایی که مولد کد هستند، می‌توانند کدهایی که برنامه‌نویس به شکل جنریک نگارش کرده است را به گونه‌ای بازسازی کنند که تبدیل به کدهایی بدون جنریک و معمولی شوند. سپس این کدهای معمولی به خورد کامپایلر داده خواهند شد. این روند به چندین روش قابل پیاده سازی است که در این نوشته ما دو مورد از آن ها را توضیح خواهیم داد:

<a name="monomorphization"></a>
### یک ریخت سازی ( Monomorphization )
عجب کلمه‌ی عجیب و بزرگی! گول ظاهر آن را نخورید، چرا که «یک ریخت سازی» از ساده ‌ترین روش‌های پیاده‌سازی جنریک است. «یک ریخت سازی» یعنی کامپایلر به ازای هر تایپی که قرار است در جنریک شرکت داده شود، یک پیاده سازی مجزا از آن جنریک را ارائه کند که مخصوص همان تایپ باشد.

مثلا تابع جنریک زیر را در نظر داشته باشید. کار این تابع این است که هر آرگومانی به آن ارسال کردیم، عینا آن را برگشت دهد (شبه کد):

```
function echo<T>( T arg)  ⟹ T {
    return arg;
}
```

اگر ما در کدهایمان به این شکل از تابع بالا استفاده کنیم:

```
echo<int>(12);    ---> 12
echo<float>(3.14);    ---> 3.14
echo<string>("hi");    ---> "hi"
```

کامپایلر در پشت صحنه قبل از اینکه برنامه را کامپایل کند، سه گروه از تابع echo را تولید خواهد کرد (به تناسب تایپ‌هایی که به آن وارد شده‌اند):

```
function echoInt( int arg ) ⟹ int{
    return arg;
}

function echoFloat( float arg ) ⟹ float {
    return arg;
}

function echoString( string arg ) ⟹ string {
    return arg;
}
```

به این روش می‌گوییم «یک ریخت سازی». در اینجا کدهای جنریک قبل از اینکه به مرحله‌ی کامپایل برسند، به کدهای معمولی و بدون جنریک تبدیل شدند. زبان‌هایی مانند ++C و ‌Rust از این روش برای پیاده‌سازی جنریک استفاده می‌کنند. عمل تولید کد کاملا در پشت صحنه و به دور از چشم برنامه‌نویسان اتفاق می‌افتد.

مزیت‌های این تکنیک:

- بالاترین حد از نظر سادگی در پیاده سازی
- بالاترین حد از نظر سرعت اجرا
- بالاترین حد از نظر امنیتِ تایپ سیستم 
- کمترین حد از نظر مصرف حافظه و منابع دیگر (تقریبا صفر)
- بدون نیاز به عملیات زمان اجرا (zero-cost abstraction)

معایب این تکنیک:

- زیاد شدن کدهایی که نیاز به تولید و کامپایل دارند (به ازای هر تایپ، یک گروه جدید از کدها تولید می‌شود)
- پایین آمدن سرعتِ کامپایل برنامه‌ها (با زیاد شدن تایپ‌ها، این افت سرعت شدیدتر خواهد شد)

<a name="type-erasure"></a>
### پاک‌سازیِ تایپ (Type Erasure)
پاک‌سازیِ تایپ شیوه‌ای از تکنیک تولید کد است که در آن اتفاقات زیر به وقوع می‌پیوندد:

- کامپایلر کدهای جنریک را آنالیز می‌کند. با این آنالیز اطلاعاتی که درباره کدهای جنریک نیاز دارد را بدست می‌آورد. (مثلا اینکه چه تایپ‌هایی در جنریک وارد شده‌اند)
- پس از کسب اطلاعات بالا، کامپایلر تمام نشانه‌های جنریک را از کدها حذف می‌کند و آن‌ها را به حالت معمولی تبدیل می نماید.
- به جای اینکه مثل تکنیک «یک ریخت سازی» چندین گروه از کدها را برای هر تایپ ایجاد کند، فقط یک نسخه‌ی غیر جنریک از کد را برای تمام تایپ‌ها تولید خواهد کرد...
- اما در این نسخه‌ی غیر جنریک، کامپایلر در قسمت‌های خاصی که لازم است (با توجه به اطلاعاتی که کسب کرده)، کدهایی برای «تبدیل تایپ» (Type Casting) ها قرار خواهد داد.
- در این روش تمام عملیات در زمان کامپایل اتفاق می‌افتد، و فقط «تبدیل تایپ» در زمان اجرا صورت خواهد گرفت. با اینحال کامپایلر به ما اطمینان می‌دهد که این تبدیل تایپ در زمان اجرا با موفقیت انجام خواهد شد.

زبانی مانند Java از این تکنیک استفاده می کند. مثلا در زیر یک کد جنریک جاوا را می‌بینید:

```
List<String> list = new ArrayList<String>();
list.add("Hi");
String x = list.get(0);
```

قبل از کامپایل نهایی، جاوا کد بالا را به شکل زیر تولید مجدد خواهد کرد:

```
List list = new ArrayList();
list.add("Hi");
String x = (String) list.get(0);
```

دقت کنید که چگونه کامپایلر تبدیل تایپ string را در نقطه‌ی دقیق قرار داده است تا برای برنامه مشکلی پیش نیاید.

مزیت‌ها و معایب این تکنیک:

- سادگیِ متوسط در پیاده سازی
- سرعت تقریبا مناسب اجرا
- امنیتِ مناسب از نظر تایپ سیستم 
- کمی حافظه‌ی سربار (بسیار قلیل)
- نیازمند به عملیات زمان اجرا، ولی به شکل بسیار محدود و کنترل شده
- سرعت کامپایل متوسط (در نهایت افت سرعت به نسب کامپایل معمولی وجود خواهد داشت، اگر چه کمتر)



[prereq]: #prereq
[intro]: #intro
[q-go-nogen]: #q-go-nogen
[golang-philosophy]: #golang-philosophy
[generic-howto]: #generic-howto
[boxing-unboxing]: #boxing-unboxing
[code-generation]: #code-generation
[monomorphization]: #monomorphization
[type-erasure]: #type-erasure
[golang-generics]: #golang-generics
[q-golang-lessgen]: #q-golang-lessgen
[golang-generic-box]: #golang-generic-box
[golang-generation]: #golang-generation
[end]: #end



[polymorphism]: http://amirrezaghaderi.ir/post/types/#polymorphism
[composition]: http://amirrezaghaderi.ir/post/types/#composition
[interface]: http://amirrezaghaderi.ir/post/types/#interface
[structural-type-system]: http://amirrezaghaderi.ir/post/types/#structural-type-system
[duck-typing]: http://amirrezaghaderi.ir/post/types/#duck-typing
[generic]: http://amirrezaghaderi.ir/post/types/#generic






