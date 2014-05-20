# Is it shaking?
An attempt to provide a decent visualization of earthquakes happening around the world. There are two primary pieces to this application, current and archive.

[http://isitshaking.com](http://isitshaking.com)

## Current
The current, or front page of application, reads a rolling 24-hr feed from the USGS. This is updated every minute.

![image](https://raw.githubusercontent.com/mattgrill/isitshaking/master/src/current.png)

## Archive
The archive portion of this application reads data stored in Google's FusionTables product. Currently the archive dataset includes earthquakes from 2009 - 2013 with a magnitude of 1.0 or greater.

![image](https://raw.githubusercontent.com/mattgrill/isitshaking/master/src/history.png)

However, the dataset for 2013 has had some additional processing. Using some simple query-string parameters you can filter the existing dataset by date and magnitude.

```
http://isitshaking/history/2013?mag=4,5&date=07/01,07/31
```

This example will return only earthquakes with magnitudes between 4.0 and 5.0, and that were recorded between July 1st and July 31st of 2013.

When using the ```mag``` parameter, an upper and lower bound is required; decimals are allowed, e.g. ```?mag=4.2,4.5```.

The ```date``` parameter however is a little more lenient. Passing just one parameter, e.g. ```date=07/01```, will return earthquakes happing on or after July 1st. Passing two identical dates,  e.g. ```date=07/01,07/01```, will return earthquakes happening on just that day.