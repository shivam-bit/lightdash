import {
    type ApiMetricsExplorerQueryResults,
    type MetricExplorerComparisonType,
    type MetricExplorerDateRange,
    type TimeDimensionConfig,
} from '@lightdash/common';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { lightdashApi } from '../../../api';

type RunMetricExplorerQueryArgs = {
    projectUuid: string;
    exploreName: string;
    metricName: string;
    dateRange: MetricExplorerDateRange;
    comparison: MetricExplorerComparisonType;
    timeDimensionOverride?: TimeDimensionConfig;
    options?: UseQueryOptions<ApiMetricsExplorerQueryResults['results']>;
};

const getUrlParams = (dateRange: MetricExplorerDateRange) => {
    const params = new URLSearchParams();

    // Add date range params
    if (dateRange) {
        params.append('startDate', dateRange[0].toString());
        params.append('endDate', dateRange[1].toString());
    }

    return params.toString();
};

const postRunMetricExplorerQuery = async ({
    projectUuid,
    exploreName,
    metricName,
    comparison,
    dateRange,
    timeDimensionOverride,
}: RunMetricExplorerQueryArgs) => {
    const queryString = getUrlParams(dateRange);

    return lightdashApi<ApiMetricsExplorerQueryResults['results']>({
        url: `/projects/${projectUuid}/metricsExplorer/${exploreName}/${metricName}/runMetricExplorerQuery${
            queryString ? `?${queryString}` : ''
        }`,
        method: 'POST',
        body: JSON.stringify({
            timeDimensionOverride,
            comparison,
        }),
    });
};

export const useRunMetricExplorerQuery = ({
    projectUuid,
    exploreName,
    metricName,
    comparison,
    dateRange,
    timeDimensionOverride,
    options,
}: Partial<RunMetricExplorerQueryArgs>) => {
    return useQuery({
        queryKey: [
            'runMetricExplorerQuery',
            projectUuid,
            exploreName,
            metricName,
            dateRange?.[0],
            dateRange?.[1],
            comparison,
            timeDimensionOverride,
        ],
        queryFn: () =>
            postRunMetricExplorerQuery({
                projectUuid: projectUuid!,
                exploreName: exploreName!,
                metricName: metricName!,
                comparison: comparison!,
                dateRange: dateRange!,
                timeDimensionOverride,
            }),
        ...options,
    });
};
