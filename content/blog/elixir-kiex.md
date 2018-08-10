+++
title = "نصب چندین نسخه از زبان الیکسیر در یک سیستم"
date  = "2016-09-12"
jdate = "۱۳۹۵/۰۶/۲۲"
draft = false

postdesc = "آموزش آسان و قدم به قدم نصب و مدیریت چندین نسخه از زبان الیکسیر در یک سیستم"
postkeywords = "الیکسیر, کیکس, ارلنگ, نصب, کامپایل, نسخه"
topic = ["برنامه نویسی", "ارلنگ", "الیکسیر"]

+++


چند وقت پیش در همین وبلاگ درباره [نصب چندین ماشینِ ارلنگ در یک سیستم][erlangkerl] صحبت کردیم. این نوشته به نوعی دنباله‌ی همون نوشته هست. برای همین پیشنهاد میکنم اول اون مطلب رو مطالعه کنید و بعد این نوشته رو بخونید.

ارلنگ مثل جاوا، زبانی هست که روی یک ماشین مجازی اجرا میشه. ماشین مجازی ارلنگ با اسم BEAM صدا زده میشه و ماشین مجازی جاوا هم با اسم JVM  معروف هست. این درسته که ‌BEAM و JVM در ابتدای کار به عنوان سکوی اجرای ارلنگ و جاوا ساخته شده بودن، اما در حال حاضر این قابلیت رو دارن که به خوبی پذیرای زبان‌های دیگه‌ای هم باشن.

[الیکسیر][elixir] زبان جوانی هست که روی ماشینِ مجازی ارلنگ اجرا میشه ([سایت فارسی الیکسیر][persianelixir]). رابطه‌ی الیکسیر با BEAM مشابه رابطه‌ای هست که کلوژور یا اسکالا با JVM دارن. ارلنگ هم مثل جاوا زبانی هست که سال‌ها پیش ساخته شده و با اینکه از استخون بندی مستحکمی برخوردار هست، اما ممکنه از دید خیلی از برنامه‌نویس‌های این دوره و زمونه اونقدرها زبان مدرنی نباشه. مدرن‌سازی این زبان‌ها هم به دلیل مسائل مربوط به سازگاری با نسخه‌های پیشین (Backward compatibility) با کندی انجام میشه. برای همین الیکسیر می‌تونه گزینه‌ی مناسبی باشه برای برنامه نویسانی که دوست دارن یک زبان مدرن‌تر رو روی پلتفرم ارلنگ تجربه کنن.

برای کار با الیکسیر مسلما اولین کار اینه که اون رو نصب کنید. خوشبختانه نصب الیکسیر خیلی راحته چون [ارلنگ سولوشنز][erlangsol] به عنوان یکی از مُبلِغ‌ها و پشتیبان تجاری پلتفرم ارلنگ، [پکیج‌های از قبل آماده شده‌ی الیکسیر][erlangsolpkg] رو براتون مهیا کرده و شما می‌تونید به آسونی ازشون استفاده کنید؛ یا اینکه مطابق این آموزش نصب حرفه‌ای تر الیکسیر رو به کمک ابزار [kiex][kiex] انجام بدید. (از این بعد اون رو «کیکس» صدا میزنیم)

کیکس یه ابزار کوچیک و ساده هست که میتونه نسخه‌ی متفاوت از زبان الیکسیر رو برای شما کامپایل کنه و این قابلیت رو به شما بده که براحتی در هر زمانی که دوست داشتید بین این نسخه‌ها سوییچ کنید. این راهنما به طور قدم به قدم و به زبانی ساده کار با این ابزار رو آموزش میده. این آموزش برای سیستم عامل [اوبونتو][ubuntu] نسخه ۱۶.۰۴ نوشته شده که تا سال ۲۰۲۱ از پشتیبانی رسمی برخوردار هست. شما می‌تونید با مقدار خیلی کمی تغییر (یا شاید هم بدون هیچ تغییری) از این راهنما برای بقیه سیستم عامل های شبه یونیکس مثل دبیان و فدورا و مک و غیره هم استفاده کنید…

بدون صحبت بیشتر، شروع می‌کنیم…

<a name="requirements"></a><a name="پیش-نیازها"></a>
## مهیا کردن پیش نیازها

در حال حاضر تنها پیش‌نیازی که الیکسیر بهش نیاز داره پلتفرم ارلنگ (نسخه‌ی ۱۸ یا بالاتر) هست. [نصب پلتفرم ارلنگ][erlangkerl] هم قبلا در همین وبلاگ توضیح داده شده. بنابراین باید اول به کمک اون آموزش پلتفرم ارلنگ رو نصب کنید.

بعد از نصب پلتفرم ارلنگ، یکی از نسخه‌های ارلنگ رو برای ترمینال فعلی فعال کنید؛ چگونگی انجام این مورد هم در اون آموزش برای شما قرار داده شده.


<a name="kiex-install"></a><a name="نصب-کیکس"></a>
## نصب کیکس

کیکس در واقع فقط یک فایل مستقل هست و برای همین نصبش کار سختی نیست. در این قسمت ما کیکس رو به کمک curl دانلود و نصب می کنیم:

```
$ cd ~

‍‍‍$ \curl -sSL https://raw.githubusercontent.com/taylor/kiex/master/install | bash -s
```

حواس‌تون باشه که دانلود فایل بالا (بدون هیچ دلیل منطقی) میتونه از طرف فیل‌کش مسدود شده باشه. در این صورت دیگه خودتون بهتر می دونید که باید از چه طریقی فیل‌کش رو دور بزنید!

بعد از دانلود و نصب کیکس، لازم هست که اون رو در مسیر اجرایی ترمینال قرار بدید. برای این کار کافیه خط زیر رو به اسکریپت آغازین ترمینال اضافه کنید. در اکثر توزیع‌های لینوکس، این اسکریپت فایلی هست به اسم `.bashrc` که در شاخه‌ی home کاربر قرار داره. این فایل رو با ادیتور محبوب تون باز کنید، و خط زیر رو به آخرش اضافه کنید:

```
# edit .bashrc


test -s "$HOME/.kiex/scripts/kiex" && source "$HOME/.kiex/scripts/kiex"
```

ادیتور رو ببندید، و دستور زیر رو در ترمینال جاری اجرا کنید تا تغییراتی که در اسکریپت ترمینال دادید اعمال بشه:

```
$ cd ~
$ source .bashrc
```

اگر همه چیز درست پیش رفته باشه، شما باید بتونید دستور `kiex` رو در ترمینال اجرا کنید. با اجرای این دستور بدون هیچ پارامتری، باید راهنمای کیکس به شما نمایش داده بشه:

```
$ kiex

kiex commands:
    list                      - shows currently installed Elixirs
    list known                - shows available Elixir releases
    list branches             - shows available Elixir branches
    install <version>         - installs the given release version
    alias <version> <alias>   - creates an alias for the given version
    use <version> [--default] - uses the given version for this shell
    shell <version>           - uses the given version for this shell
    default <version>         - sets the default version to be used
    selfupdate                - updates kiex itself
    implode                   - removes kiex and all installed Elixirs
    reset                     - resets default Elixir version to null
```

بعد از نصب کیکس، باید ازش درخواست کنیم که نسخه‌های قابل نصب الیکسیر رو برامون نمایش بده تا ما بتونیم از بین شون انتخاب کنیم:

```
$ kiex list known
```

کیکس به مخزن گیت‌هاب زبان الیکسیر وصل میشه و برامون لیستی از نسخه‌های قابل نصب رو نمایش میده:

```
Getting the available releases from https://github.com/elixir-lang/elixir/releases

Known Elixir releases:
    . . .
    . . .
    1.2.0
    1.2.1
    1.2.2
    1.2.3
    1.2.4
    1.2.5
    1.2.6
    1.3.0
    1.3.0-rc.0
    1.3.0-rc.1
    1.3.1
    1.3.2
```

<a name="compile-install"></a><a name="کامپایل-نصب"></a>
## کامپایل و نصب الیکسیر

از لیست نمایش داده شده، یکی از نسخه‌ها رو انتخاب کنید و کیکس بگید که اون رو برای شما نصب کنه. با وارد کردن این دستور، کیکس ابتدا به کمک git مخزن زبان الیکسیر رو از اینترنت میگیره و به صورت اتوماتیک زبان الیکسیر رو کامپایل و نصب میکنه:

```
$ kiex install 1.3.2
```

این پروسه با توجه به سرعت اینترنت شما (دریافت مخزن از اینترنت) و سرعت دستگاه‌تون، میتونه چیزی بین ۱۵ تا ۴۰-۵۰ دقیقه طول بکشه. صبور باشید.

بعد از اینکه کامپایل به پایان رسید، می‌تونید از درست انجام شدن این کار اطمینان حاصل کنید. دستور زیر لیستی از تمام نسخه‌های الیکسیر که به کمک کیکس نصب شدن رو به شما نشون میده:

```
$ kiex list
```

از بین لیست پیش روتون، میتونید به کیکس اعلام کنید که یکی از اون‌ها رو برای ترمینال جاری فعال کنه:

```
$ kiex use 1.3.2
```

و در نهایت…………………………. شروع کنید…

```
$ iex
```


[erlangkerl]: http://amirrezaghaderi.ir/post/erlang-kerl/
[elixir]: http://elixir-lang.org/
[persianelixir]: http://elixir-lang.ir/
[kiex]: https://github.com/taylor/kiex
[erlang]: http://www.erlang.org/
[erlangsol]: https://www.erlang-solutions.com/
[erlangsolpkg]: https://www.erlang-solutions.com/resources/download.html
[kerl]: https://github.com/kerl/kerl
[ubuntu]: http://www.ubuntu.com/