import React from 'react';
import { connect } from 'react-redux';

import '../../assets/css/busTablet.css';

class BusTablet extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            busPage: 1,
            showTablet: false
        }; 

    }

    componentDidMount() { 
        window.busTablet = {
            enable: (enable) => {
                if(enable) {
                    if (mp) mp.trigger(`toBlur`, 200);
                    mp.invoke('focus', true);
                    mp.trigger('setBlockControl', true);
                    mp.trigger("setTabletActive", true);
                    this.setState({ showTablet: true });
                } else {
                    if (mp) mp.trigger(`fromBlur`, 200);
                    mp.invoke('focus', false);
                    mp.trigger('setBlockControl', false);
                    mp.trigger("setTabletActive", false);  
                    this.setState({ showTablet: false });
                }
            },
            active: () => {
                return this.state.showTablet;
            },
            changeOptions: (event, options) => {
    
            },
        };
    }

    render() {
        const { showTablet } = this.state;
        return (
            <React.Fragment style={showTablet === true ? {display: 'block'} : {display: 'none'}}>
            <div className="busMenu center1" style={this.state.busPage === 1 ? {display: 'block'} : {display: 'none'}}>
                <div className="logIn center">
                    <div className="text">Войти в систему <br/>таксокомпании?</div>
                    <button>Войти</button>
                </div>
            </div>
            <div className="busMenu center1" style={this.state.busPage === 2 ? {display: 'block'} : {display: 'none'}}>
                <div className="logInAnim">
                    <div className="header">Авторизация в системе</div>
                    <div className="logIn center" style={{display: 'grid', marginTop: '1.8em'}}>
                        <input type="text" readonly="readonly"/>
                        <input type="password" readonly="readonly"/>
                        <button className="">Войти</button>
                    </div>
                </div>
            </div>
            <div className="busMenu center1" style={this.state.busPage === 3 ? {display: 'block'} : {display: 'none'}}>
                <div className="header">Включение бортового компьютера</div>
                <div className="center text">Подождите...</div>
            </div>
            <div className="busMenu center1">
                <div className="main">
                    <div className="menu">
                        <div className="title-menu">Меню</div>
                        <a>
                            <div className="item selected">Статистика</div>
                        </a>
                        <a>
                            <div className="item">Мой рейс</div>
                        </a>
                        <a>
                            <div className="item">Все рейсы</div>
                        </a>
                    </div>
                    <div className="content">
                        <div style={{display: 'block'}}>
                            <table className="stats">
                                <tbody>
                                    <tr>
                                        <td>
                                            <svg xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink" width="2.962962962962963vh" height="2.962962962962963vh" viewBox="0 0 32 32">
                                                <image id="Группа_2" data-name="Группа 2" width="2.962962962962963vh" height="2.962962962962963vh" xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAE/0lEQVRYhbVXW2xVRRRd8zjntqW0VWxD5WERYjG3EpJSDYJNIBojUaPxERCaqkSp4WFq+PAREj5EEhLph8b6IGmU8MOHEvXHxGAi8EMhJvUDrVAUaWtaW6Hve+6ZGbPn3N5Hz73tbdqurzNz9uy198yevfewaPQFEETBracANAOoA1CMEAwABmM4jAGEUDCGWSHGDJSSYNDg3EBbyawYAdAO4PjQ4vj3lreiIkrk7wNoBbAKgJu+0mgDzgrBmAeAg3MFITS0FmAJFjJKSt+ONRmpDRyHJwzOsMNNcLwU8YQTi+izbF3tY08C+C6buYHX5BWDUsJ6mg/ILqUDWcE4TO51T0sAb4VpjdXCDQcYh9Ymb/JJs8noSV10UjmWN5MBG0LT5IVhgSHZF84KATlDFmUb6KAWp9FaT1muEJoTjDXEZKpezDP3LhXZCwGKBaYz9ScN0MZACGfByAMwCMmhVeoorAFaaQjmQYfPaE64Z+UyKEXOpbRQQHPpQWudMoDzMnApoUl6nrDt8S349us2tH1+DBXli6ASXmutIAVd6TsCAyjWhRxAPO6Asfk5/0e3bsbRI+/Y77q69di8sT6RmGA54p5rOSkqJcW877vgTIcUzQa0pa4rUV//CD489l5y5dmffsYPP55Hum+MayifQzABTjlcCn/OXkciEdREo2hJI790uQNvH2rBxMQwfD8zvqR0EdceZJCmQvosTFB/cv1Oc4mhrnYdWj8+mpzq+PUKdu85mC4ShtbgjhuD78vQP8oHlUvL8dwz2+BGimBM7hsSranOIL/y21Xsenl/SC4dvh+H4xZAas1DeZ7iYs3q5Wj74jhKS0tRVlKIL0+egTLhW7Lm3iqcPNGSHF/r+gs7G/eBMR6STQcFI8VNTqma6FpLTnjzwB7saHgWbIr4ihV349RXH0EIYcfd3b14cecbUCr/gBaVy1cdDnYhNUmfv3deR2lJCR6oWWvnNj1Ui5s3e9H5R5cdV1ZW4PSpVhQVFdpxT08PXt97CIOD/+V1nY3NvAJiSfn9hx3Xs03FVJy7cBErllWi+r7V9s/WLZtw7vxFjIyM4pvTJ1BaGtSx/v4BPL+9Cf8ODGYPtiyQ0kHcGwerWf+EkW4MWomQFMWd0RqfffIBHt74oJ3zfR+3bg/hriV32vHQ0DB2NDajt6cHvu/NePbJrRcSnhcD58KH8rMXIfJGSIHdTe+i/XKHnZNSJslHx8axfdde3Pz7BpTy8ya3jsQ9OI4IUrGUMegsR4DEWbkOx2tNB9HZeS0573lx7Grcj+6ef0JrZoIxGtKJUBoApys3PlYMx/GmXUYXteHVAxgeHrPjhlf2oev6jZBcPiDyifEhK0lNqaGtM5iA0e70QcSAivJylBQvwtWuP0O/8wHlHDfCMDpCnbSGRGJLYAoApnJ39Ilt6O/vQ1/fNDIzgHY8Nq4hE8k3dfBMg+fRjs2lZTOTNSEtWDMiT/Ogg12orpC2X0/J5mTAcFIg2bXOvwlWowlVxREy4NJUYVv5che/WSOlLuRYOxnQElLIUn2AEAyc82nLcWg5SzhBz9Sw1+loEYXVKzvpoQigPpuEUgzxuILjyKCj5QmDKIukXqfgtiIGryki51za+jLNk+7I2G35qSirqgK9UiOe+AXAUgAV6S9km44FvXJJafDopM42IEzIcG5TMXkbvAmDZ1gW8lEAF6jCEzkA/A9P9uG5oWXoPgAAAABJRU5ErkJggg=="></image>
                                            </svg>
                                        </td>
                                        <td>Кругов за сегодня</td>
                                        <td className="orders">125</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <svg xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink" width="2.962962962962963vh" height="2.962962962962963vh" viewBox="0 0 32 32">
                                                <image id="Прямоугольник_6_копия" data-name="Прямоугольник 6 копия" width="2.962962962962963vh" height="2.962962962962963vh" xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADcklEQVRYhcWXW0wUVxjHfzOzW4spiKbtLos3soJWbKmyGC8VowR7QaLBxDa+Nk03trWxaE1fTNPUS7w+ab0lRl9MTEwJa3jQQtIITRoQWRVSC2SprYmrhYpQIO7OTHNGWLIONGd3RX7JZud8Z875/+fMdy6jvFVYyjDlwHagCHiFiaEfaASOAJeFgubyeMX/98APQA7w0gSJM9y30NgCOIE6YWD9sPiLphhoVoGvJkF8hO3CgM8WfnH4hIH0ZOWmTk2zfimQ7kildU31eTRNZdWaCkCx1cugJis+P8/L9MxpZKSnk78w11Yvi1gHTPnbTfIX5rGzciuLC/Ljam63tXHw8Blagrdtrf6PhAxkuV1crjqLwzH+m9v04ad0dIZs8fGQfgWKorPts09i4uHwQ3Z88x2fb9tN8Oao4Knj+1BV+XwY/1GeQdOmsHLF27HgoSOnuFrbgKZFaLx+nYafA5bw1dprqKqGYURtfYyFtAGn0xE35ebmeDBMMKNODOMJH/v9dP89xN2/wijIp5VYir+1RcdA13U2lr9LRsbTfWqpbzEet5uenm7CD7oJ339E7+P+hCejtAGGR2H5ssJYecECLxUb36eosICoodPeLp98SRloudnGnNkzyZ2XExf3eFyUrHmHFct91P/SzMDAv7a245GQAUFtXT2h0F1mzJiOJ8sVV+d2vcbqVT4uVdWg63J5kJABRVFQFJX2zi6qA1e4Vv8rTyIR8t+Yb9UJMjOn8UfXn9zp6JLKh4SWYsMwyJs3hyzXq1a5te139h84xuYtfh739cXue3NRLoZhaz4m0gZKS4r58eJpLl44ydeVfgxz9PnaO0L09PTGykNDUTTN1sWYSBuIRHS83rnWdcnaYsrL1qKqKg6nTtl766zkHKE52AqmXA5I7wWRKJw7vZeiotHzy71799ENndmzsmOxzs4Qmz7yY0oakB4Bh2ZSuWsPwVutsVh2tjtO/Lc7Hfi/2C0tLkhoNxRLr2GYVGxYx7KlSyj7oMSKB2p+oqmpharqK7Y2z9XAswSbngoW+EqTPhElfyRTFP551IumqtYuKDvtbN2kMgJpaS9bC9DAwKCtThYxAn3JnowHB4dssQTpF7OgKdVeUqBRGDg6iQaOCgMBYM8kiAvNwMjXcR1wQ+yowOsT+IUsDgoNwJfACYD/AEdeBYswkH6sAAAAAElFTkSuQmCC"></image>
                                            </svg>
                                        </td>
                                        <td>Доход за сегодня</td>
                                        <td className="pay">12150$</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <svg xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink" width="2.962962962962963vh" height="2.962962962962963vh" viewBox="0 0 32 32">
                                                <image id="star" width="2.962962962962963vh" height="2.962962962962963vh" xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEjklEQVRYhb2XXWhcRRTH//Nxd/PdxJLEtjSkNjU2MWltNw+mRTHY0tYmVmnaKtqW4JMPlgp9UFFSGhUVTKGiBUGFIihShLYUsW0erLViFdGIilA/QPHFJOZ7s/feGTlzN5vNzt3Nbo3+YODOnHPnnDkzc2aGNTd3gxBFf3cCOAygDUAZLDQABq05tAaE8KE1M0qMafi+BIMC5xrKaIYyAeAagFfHyt1zxm5NTTMZ7wPwBoBVACLpf2qlwVkxGEsA4ODchxAKSgmwpBVySkrP1BU5qTQchycdnudHJGnj4WhCODNRNcBaN27ZCeBsmLvBqGlUDL4vzEjzgfzyVaArGIfO/l+XBPDkbI1ZcaMGYUZBoS0EIWY709Z0pEXlMMUpVlDPi0uMHCi/0S6b1q5Ba0uT1V4A5fLf/H3ieB+W3lSF9W1bLVm+8Fk9pQub45trq41x4tY1t1jyXCh/zpZxQPkKwmyz/Hlo766U7sH9ewobtUxAKTXnAOeV4DL/2ZBSYm93V6q+Y1sHllTkv5SkoC0dRI8zaAg5BNd1LMVsbN92D4qKovOk3bs7s2jbuImIsQmmwWmXel4EnClLMZNoNIpV9SvRc2CfJdu3pwsNq+tRXh6SxTNgXMH3OLgWYM3rt+uIMwM/LbUSx3qPYElFBUpLi1FSUoKKijIT5rKyUqvDdGYSCQwNjWBiYhKTk1OmTE/HceSpvpRWcJZIJNw4JOhAsTIgUFVVic3tbVb7glGKRLB8We28tm8Hf7D0DEpBrKir6zUnGZufis9/NICx8XFsugEn0jn55ik889xLVrtSPqQTgahZ1tA7azjzLBj87kdc//lXbL33bquDfDj2wnGcevd0qCZjdFLquUSUjQuXLmN/zyGMjo1n0bDxPA+PP/E0Tn943pJlwjlXqYtFNmgOd+3uycsJWnAPdD+Gz65+acnSMaPnHNxNRM1lYiFGRkZNAlpwRIJjeHjEas9ESgduIg5Ol4x8ToH2O2MoLSm22jOhXdDRsdlqD4UJcC48+N7CWTC2odVqy8btTY1ZJHN4bgKOI4JULOUMlM69Hm9rbJhXV0rjxZdfw7NHXzHznk5bbJ31fzpaK0gnSmkgSMXTU2VwnOynIaXgDXe0pOpXP/8KXQ8exPsfnMHZcxew4/5HcXHgckpet3JFzpRMxuPTY+Zb1C5f3SsdDaVdMAhLmdjUHkPnfVvw+x9/4mhfP068/jbGxidS8nh8Bh9f/ATfDH5v7gbV1Usx9NewySNhOBEF142aeybdioM1qLk5JMJobVmL2MZ1eOud90KkNgce6cb1X37Dp1e+sGTGFMWeBVM+50BIJvyvSL985V55/wPkQP45dvGZIAdSOZNCY4pKFr04RWX0lcY1cqDfGhcLCku+cChn6wJuzbSWAn1lXnc51la/KG6s+4keigDuCtPwfQbX9eE40iQfeicah8xKTr1OwQVtYUprOnnQSPNozfGefH5qVJ4UlfX1oFdqNCG+pus+gJr0FzLZoCgEnQaPTrpMBAaTOpzD9z0zWnIwiJ0OMz4J4AqAQ2QcAP4BywuxjUGkzFwAAAAASUVORK5CYII="></image>
                                            </svg>
                                        </td>
                                        <td>Пассажиор за сегодня</td>
                                        <td className="rating">0</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <svg xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink" width="2.962962962962963vh" height="2.962962962962963vh" viewBox="0 0 32 32">
                                                <image id="star" width="2.962962962962963vh" height="2.962962962962963vh" xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEjklEQVRYhb2XXWhcRRTH//Nxd/PdxJLEtjSkNjU2MWltNw+mRTHY0tYmVmnaKtqW4JMPlgp9UFFSGhUVTKGiBUGFIihShLYUsW0erLViFdGIilA/QPHFJOZ7s/feGTlzN5vNzt3Nbo3+YODOnHPnnDkzc2aGNTd3gxBFf3cCOAygDUAZLDQABq05tAaE8KE1M0qMafi+BIMC5xrKaIYyAeAagFfHyt1zxm5NTTMZ7wPwBoBVACLpf2qlwVkxGEsA4ODchxAKSgmwpBVySkrP1BU5qTQchycdnudHJGnj4WhCODNRNcBaN27ZCeBsmLvBqGlUDL4vzEjzgfzyVaArGIfO/l+XBPDkbI1ZcaMGYUZBoS0EIWY709Z0pEXlMMUpVlDPi0uMHCi/0S6b1q5Ba0uT1V4A5fLf/H3ieB+W3lSF9W1bLVm+8Fk9pQub45trq41x4tY1t1jyXCh/zpZxQPkKwmyz/Hlo766U7sH9ewobtUxAKTXnAOeV4DL/2ZBSYm93V6q+Y1sHllTkv5SkoC0dRI8zaAg5BNd1LMVsbN92D4qKovOk3bs7s2jbuImIsQmmwWmXel4EnClLMZNoNIpV9SvRc2CfJdu3pwsNq+tRXh6SxTNgXMH3OLgWYM3rt+uIMwM/LbUSx3qPYElFBUpLi1FSUoKKijIT5rKyUqvDdGYSCQwNjWBiYhKTk1OmTE/HceSpvpRWcJZIJNw4JOhAsTIgUFVVic3tbVb7glGKRLB8We28tm8Hf7D0DEpBrKir6zUnGZufis9/NICx8XFsugEn0jn55ik889xLVrtSPqQTgahZ1tA7azjzLBj87kdc//lXbL33bquDfDj2wnGcevd0qCZjdFLquUSUjQuXLmN/zyGMjo1n0bDxPA+PP/E0Tn943pJlwjlXqYtFNmgOd+3uycsJWnAPdD+Gz65+acnSMaPnHNxNRM1lYiFGRkZNAlpwRIJjeHjEas9ESgduIg5Ol4x8ToH2O2MoLSm22jOhXdDRsdlqD4UJcC48+N7CWTC2odVqy8btTY1ZJHN4bgKOI4JULOUMlM69Hm9rbJhXV0rjxZdfw7NHXzHznk5bbJ31fzpaK0gnSmkgSMXTU2VwnOynIaXgDXe0pOpXP/8KXQ8exPsfnMHZcxew4/5HcXHgckpet3JFzpRMxuPTY+Zb1C5f3SsdDaVdMAhLmdjUHkPnfVvw+x9/4mhfP068/jbGxidS8nh8Bh9f/ATfDH5v7gbV1Usx9NewySNhOBEF142aeybdioM1qLk5JMJobVmL2MZ1eOud90KkNgce6cb1X37Dp1e+sGTGFMWeBVM+50BIJvyvSL985V55/wPkQP45dvGZIAdSOZNCY4pKFr04RWX0lcY1cqDfGhcLCku+cChn6wJuzbSWAn1lXnc51la/KG6s+4keigDuCtPwfQbX9eE40iQfeicah8xKTr1OwQVtYUprOnnQSPNozfGefH5qVJ4UlfX1oFdqNCG+pus+gJr0FzLZoCgEnQaPTrpMBAaTOpzD9z0zWnIwiJ0OMz4J4AqAQ2QcAP4BywuxjUGkzFwAAAAASUVORK5CYII="></image>
                                            </svg>
                                        </td>
                                        <td>Нарушений на сумму</td>
                                        <td className="rating">9200$</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <svg xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink" width="2.962962962962963vh" height="2.962962962962963vh" viewBox="0 0 32 32">
                                                <image id="star" width="2.962962962962963vh" height="2.962962962962963vh" xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEjklEQVRYhb2XXWhcRRTH//Nxd/PdxJLEtjSkNjU2MWltNw+mRTHY0tYmVmnaKtqW4JMPlgp9UFFSGhUVTKGiBUGFIihShLYUsW0erLViFdGIilA/QPHFJOZ7s/feGTlzN5vNzt3Nbo3+YODOnHPnnDkzc2aGNTd3gxBFf3cCOAygDUAZLDQABq05tAaE8KE1M0qMafi+BIMC5xrKaIYyAeAagFfHyt1zxm5NTTMZ7wPwBoBVACLpf2qlwVkxGEsA4ODchxAKSgmwpBVySkrP1BU5qTQchycdnudHJGnj4WhCODNRNcBaN27ZCeBsmLvBqGlUDL4vzEjzgfzyVaArGIfO/l+XBPDkbI1ZcaMGYUZBoS0EIWY709Z0pEXlMMUpVlDPi0uMHCi/0S6b1q5Ba0uT1V4A5fLf/H3ieB+W3lSF9W1bLVm+8Fk9pQub45trq41x4tY1t1jyXCh/zpZxQPkKwmyz/Hlo766U7sH9ewobtUxAKTXnAOeV4DL/2ZBSYm93V6q+Y1sHllTkv5SkoC0dRI8zaAg5BNd1LMVsbN92D4qKovOk3bs7s2jbuImIsQmmwWmXel4EnClLMZNoNIpV9SvRc2CfJdu3pwsNq+tRXh6SxTNgXMH3OLgWYM3rt+uIMwM/LbUSx3qPYElFBUpLi1FSUoKKijIT5rKyUqvDdGYSCQwNjWBiYhKTk1OmTE/HceSpvpRWcJZIJNw4JOhAsTIgUFVVic3tbVb7glGKRLB8We28tm8Hf7D0DEpBrKir6zUnGZufis9/NICx8XFsugEn0jn55ik889xLVrtSPqQTgahZ1tA7azjzLBj87kdc//lXbL33bquDfDj2wnGcevd0qCZjdFLquUSUjQuXLmN/zyGMjo1n0bDxPA+PP/E0Tn943pJlwjlXqYtFNmgOd+3uycsJWnAPdD+Gz65+acnSMaPnHNxNRM1lYiFGRkZNAlpwRIJjeHjEas9ESgduIg5Ol4x8ToH2O2MoLSm22jOhXdDRsdlqD4UJcC48+N7CWTC2odVqy8btTY1ZJHN4bgKOI4JULOUMlM69Hm9rbJhXV0rjxZdfw7NHXzHznk5bbJ31fzpaK0gnSmkgSMXTU2VwnOynIaXgDXe0pOpXP/8KXQ8exPsfnMHZcxew4/5HcXHgckpet3JFzpRMxuPTY+Zb1C5f3SsdDaVdMAhLmdjUHkPnfVvw+x9/4mhfP068/jbGxidS8nh8Bh9f/ATfDH5v7gbV1Usx9NewySNhOBEF142aeybdioM1qLk5JMJobVmL2MZ1eOud90KkNgce6cb1X37Dp1e+sGTGFMWeBVM+50BIJvyvSL985V55/wPkQP45dvGZIAdSOZNCY4pKFr04RWX0lcY1cqDfGhcLCku+cChn6wJuzbSWAn1lXnc51la/KG6s+4keigDuCtPwfQbX9eE40iQfeicah8xKTr1OwQVtYUprOnnQSPNozfGefH5qVJ4UlfX1oFdqNCG+pus+gJr0FzLZoCgEnQaPTrpMBAaTOpzD9z0zWnIwiJ0OMz4J4AqAQ2QcAP4BywuxjUGkzFwAAAAASUVORK5CYII="></image>
                                            </svg>
                                        </td>
                                        <td>Повреждений на сумму</td>
                                        <td className="rating">350$</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div style={{display: 'none'}}>
                            <hr/>
                            <div>
                                <div className="headerfix">Вы не в рейсе.</div>
                            </div>
                        </div>
                        <div style={{display: 'none'}}>
                            <hr/>
                            <div className="headerfix">Мой рейс</div>
                            <div className="info">
                                <div className="bold" style={{marginTop: '-0.7407407407407407vh'}}>Los - Santos - Sandy Shores | № 12</div>
                            </div>
                            <div className="jobBusinfo">
                                <div className="bold">Длина моего маршрута</div>
                                <div className="small">Пройдено пути: 67% / 100%</div>
                                <div className="bold">План выполненной работы:</div>
                                <div className="small">Пассажиров: 34 чел. / 50 чел.</div>
                                <div className="bold">Остановок пройдено:</div>
                                <div className="small">27 / 98</div>
                                <div className="bold">Время в текущем рейсе:</div>
                                <div className="small">1ч 53м 47сек</div>
                                <div className="bold">Заработано на этот рейс:</div>
                                <div className="small">12150$</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {

    };
};

const connected = connect(mapStateToProps)(BusTablet);
export { connected as BusTablet }; 