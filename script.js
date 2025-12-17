document.addEventListener('DOMContentLoaded', () => {
    fetch('weather_data.json') 
        .then(response => {
            if (!response.ok) {
                // 如果 JSON 文件不存在或載入失敗 (例如第一次運行 Actions 之前)
                throw new Error(`無法載入 weather_data.json: status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const lastUpdatedElement = document.getElementById('last-updated');
            const weatherDisplayElement = document.getElementById('weather-display');
            const pageTitleElement = document.getElementById('page-title');

            if (data && data.locationName && data.forecasts) {
                // 成功載入資料
                pageTitleElement.textContent = `🌦️ ${data.locationName} 天氣預報`;
                lastUpdatedElement.textContent = `最後更新時間：${data.lastUpdated} (CST)`;

                let tableHTML = '<table>';
                tableHTML += '<thead><tr><th>時段</th><th>天氣現象</th><th>降雨機率</th><th>溫度範圍</th><th>舒適度</th></tr></thead>';
                tableHTML += '<tbody>';

                data.forecasts.forEach(forecast => {
                    tableHTML += `<tr>
                        <td>${forecast.timeDisplay}</td>
                        <td>${forecast.Weather || 'N/A'}</td>
                        <td>${forecast.PoP || 'N/A'}</td>
                        <td>${forecast.MinT} ~ ${forecast.MaxT}</td>
                        <td>${forecast.Comfort || 'N/A'}</td>
                    </tr>`;
                });

                tableHTML += '</tbody></table>';
                weatherDisplayElement.innerHTML = tableHTML;

            } else {
                weatherDisplayElement.innerHTML = '<p class="error-text">❌ 未能取得有效的氣象資料，請檢查 Actions 運行結果。</p>';
                lastUpdatedElement.textContent = '資料結構錯誤或無資料';
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing weather data:', error);
            document.getElementById('weather-display').innerHTML = '<p class="error-text">❌ 載入天氣資料時發生錯誤，請檢查 `weather_data.json` 是否存在。</p>';
            document.getElementById('last-updated').textContent = '載入錯誤';
        });
});
